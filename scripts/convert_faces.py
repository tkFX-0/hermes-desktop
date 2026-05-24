"""
StackChan 顔画像変換スクリプト
PNG → JPEG → C ヘッダファイル (ファームウェアに埋め込む)
"""

import os, sys
from pathlib import Path
from PIL import Image

REPO_ROOT = Path(__file__).resolve().parents[1]
FACE_DIR = Path(os.environ.get("SHIKISHIMA_FACE_DIR", REPO_ROOT / "stackchan-face-assets"))
OUT_DIR = Path(os.environ.get("SHIKISHIMA_FACE_OUT_DIR", REPO_ROOT / "docs" / "firmware" / "shikishima_cores3"))
DISPLAY_W, DISPLAY_H = 320, 240   # フルスクリーン
JPEG_QUALITY = 45                  # JPEG品質 (30〜60)

# 顔名 → 変数名マッピング
FACE_MAP = {
    "ノーマル.png":       "face_normal",
    "口パク.png":         "face_kuchipaku",
    "笑顔.png":          "face_smile",
    "あっかんべー.png":   "face_tongue",
    "あっかんべー2.png":  "face_tongue2",
    "撫でられてうれしい.png": "face_happy",
    "焦り.png":          "face_panic",
    "頑張るぞ.png":       "face_ganbaru",
    "zzz.png":           "face_zzz",
    "dvdモード.png":      "face_dvd",
}

def png_to_c_array(img_path: Path, var_name: str) -> tuple[str, int]:
    """PNG → JPEG バイト列 → C配列文字列"""
    img = Image.open(img_path).convert("RGB")

    # アスペクト比を保ちながらリサイズ
    ratio = min(DISPLAY_W / img.width, DISPLAY_H / img.height)
    new_w = int(img.width  * ratio)
    new_h = int(img.height * ratio)
    img = img.resize((new_w, new_h), Image.LANCZOS)

    # 中央配置の黒背景キャンバスに貼り付け
    canvas = Image.new("RGB", (DISPLAY_W, DISPLAY_H), (0, 0, 0))
    x = (DISPLAY_W - new_w) // 2
    y = (DISPLAY_H - new_h) // 2
    canvas.paste(img, (x, y))

    # JPEG圧縮
    import io
    buf = io.BytesIO()
    canvas.save(buf, format="JPEG", quality=JPEG_QUALITY, optimize=True)
    data = buf.getvalue()

    # C配列生成
    hex_vals = ", ".join(f"0x{b:02X}" for b in data)
    c_arr = (
        f"// {img_path.name} → {new_w}x{new_h} → JPEG {len(data)//1024}KB\n"
        f"const uint8_t {var_name}[] PROGMEM = {{\n  {hex_vals}\n}};\n"
        f"const size_t {var_name}_len = {len(data)};\n"
    )
    return c_arr, len(data)

def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_h = OUT_DIR / "faces_data.h"

    lines = [
        "#pragma once",
        "#include <Arduino.h>",
        "",
        "// 自動生成 by convert_faces.py",
        "// StackChan 顔画像データ (JPEG embedded)",
        "",
    ]

    total = 0
    index_entries = []   # face_map配列用

    for fname, var_name in FACE_MAP.items():
        src = FACE_DIR / fname
        if not src.exists():
            print(f"  スキップ (未検出): {fname}")
            continue
        try:
            c_arr, size = png_to_c_array(src, var_name)
            lines.append(c_arr)
            total += size
            index_entries.append((var_name, fname))
            print(f"  変換: {fname} → {var_name} ({size//1024}KB)")
        except Exception as e:
            print(f"  エラー {fname}: {e}")

    # 顔インデックス配列
    lines.append("// 顔インデックス (bot の face_mode コマンドで切り替え)")
    lines.append("struct FaceEntry { const uint8_t* data; const size_t* len; const char* name; };")
    lines.append("const FaceEntry FACE_INDEX[] = {")
    for var_name, fname in index_entries:
        label = fname.replace(".png", "")
        lines.append(f'  {{ {var_name}, &{var_name}_len, "{label}" }},')
    lines.append("};")
    lines.append(f"const int FACE_INDEX_COUNT = {len(index_entries)};")

    out_h.write_text("\n".join(lines), encoding="utf-8")
    print(f"\n生成完了: {out_h}")
    print(f"合計サイズ: {total//1024} KB ({len(index_entries)}枚)")

if __name__ == "__main__":
    main()