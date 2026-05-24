//+------------------------------------------------------------------+
//| ShikishimaDataExport.mq5                                         |
//| 用途: アカウント情報をJSONファイルに書き出す (既存EAに影響なし)    |
//| 設置: MT5 → ナビゲーター → エキスパートアドバイザー → ドラッグ   |
//| 出力: MQL5\Files\shikishima_mt5.json (1分ごと更新)              |
//| ※ 既存のKillZone/SilverBullet EAとは完全に独立したEA            |
//+------------------------------------------------------------------+
#property copyright "Shikishima"
#property version   "1.00"
#property strict

input int    UpdateIntervalSec = 60;    // 更新間隔(秒)
input string OutputFileName    = "shikishima_mt5.json";  // 出力ファイル名
input int    HistoryDays       = 7;     // 履歴取得日数

datetime _lastUpdate = 0;

int OnInit() {
   ExportData();
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason) {}

void OnTick() {
   if(TimeCurrent() - _lastUpdate >= UpdateIntervalSec) {
      ExportData();
      _lastUpdate = TimeCurrent();
   }
}

void ExportData() {
   string json = BuildJson();
   int fh = FileOpen(OutputFileName, FILE_WRITE | FILE_TXT | FILE_ANSI);
   if(fh == INVALID_HANDLE) {
      Print("[ShikishimaExport] ファイルオープン失敗: ", GetLastError());
      return;
   }
   FileWriteString(fh, json);
   FileClose(fh);
   // Print("[ShikishimaExport] 更新完了: ", OutputFileName);
}

string DoubleToStr2(double v) { return DoubleToString(v, 2); }

string BuildJson() {
   string nl = "\n";
   string j  = "{" + nl;

   // --- updatedAt ---
   MqlDateTime dt;
   TimeToStruct(TimeCurrent() + (int)(3600 * 9), dt); // JST
   j += "  \"updatedAt\": \"" +
        IntegerToString(dt.year) + "-" +
        StringFormat("%02d", dt.mon)  + "-" +
        StringFormat("%02d", dt.day)  + " " +
        StringFormat("%02d", dt.hour) + ":" +
        StringFormat("%02d", dt.min)  + ":" +
        StringFormat("%02d", dt.sec)  + "\"," + nl;

   // --- account ---
   j += "  \"account\": {" + nl;
   j += "    \"balance\":    " + DoubleToStr2(AccountInfoDouble(ACCOUNT_BALANCE))     + "," + nl;
   j += "    \"equity\":     " + DoubleToStr2(AccountInfoDouble(ACCOUNT_EQUITY))      + "," + nl;
   j += "    \"margin\":     " + DoubleToStr2(AccountInfoDouble(ACCOUNT_MARGIN))      + "," + nl;
   j += "    \"freeMargin\": " + DoubleToStr2(AccountInfoDouble(ACCOUNT_FREEMARGIN))  + "," + nl;
   j += "    \"profit\":     " + DoubleToStr2(AccountInfoDouble(ACCOUNT_PROFIT))      + "," + nl;
   j += "    \"currency\":   \"" + AccountInfoString(ACCOUNT_CURRENCY)               + "\"" + nl;
   j += "  }," + nl;

   // --- positions ---
   j += "  \"positions\": [" + nl;
   int totalPos = PositionsTotal();
   for(int i = 0; i < totalPos; i++) {
      ulong ticket = PositionGetTicket(i);
      if(!PositionSelectByTicket(ticket)) continue;
      if(i > 0) j += "    ," + nl;
      j += "    {" + nl;
      j += "      \"ticket\":       " + IntegerToString((long)ticket) + "," + nl;
      j += "      \"symbol\":       \"" + PositionGetString(POSITION_SYMBOL)      + "\"," + nl;
      j += "      \"type\":         "   + IntegerToString((int)PositionGetInteger(POSITION_TYPE)) + "," + nl;
      j += "      \"lots\":         "   + DoubleToStr2(PositionGetDouble(POSITION_VOLUME))        + "," + nl;
      j += "      \"openPrice\":    "   + DoubleToStr2(PositionGetDouble(POSITION_PRICE_OPEN))    + "," + nl;
      j += "      \"currentPrice\": "   + DoubleToStr2(PositionGetDouble(POSITION_PRICE_CURRENT)) + "," + nl;
      j += "      \"profit\":       "   + DoubleToStr2(PositionGetDouble(POSITION_PROFIT))        + "," + nl;
      j += "      \"swap\":         "   + DoubleToStr2(PositionGetDouble(POSITION_SWAP))          + "," + nl;
      j += "      \"commission\":   "   + DoubleToStr2(PositionGetDouble(POSITION_COMMISSION))    + nl;
      j += "    }" + nl;
   }
   j += "  ]," + nl;

   // --- summary ---
   double balance    = AccountInfoDouble(ACCOUNT_BALANCE);
   double equity     = AccountInfoDouble(ACCOUNT_EQUITY);
   double ddPct      = balance > 0 ? (balance - equity) / balance * 100.0 : 0.0;

   // 本日損益 (履歴から集計)
   double todayProfit = 0, weekProfit = 0;
   int    totalTrades = 0, wins = 0;
   datetime dayStart  = StringToTime(TimeToString(TimeCurrent(), TIME_DATE));
   datetime weekStart = dayStart - (datetime)(HistoryDays * 86400);

   if(HistorySelect(weekStart, TimeCurrent())) {
      int histTotal = HistoryDealsTotal();
      for(int i = 0; i < histTotal; i++) {
         ulong dTicket = HistoryDealGetTicket(i);
         if(!HistoryDealSelect(dTicket)) continue;
         if(HistoryDealGetInteger(dTicket, DEAL_ENTRY) != DEAL_ENTRY_OUT) continue;
         double dp = HistoryDealGetDouble(dTicket, DEAL_PROFIT);
         datetime dTime = (datetime)HistoryDealGetInteger(dTicket, DEAL_TIME);
         weekProfit += dp;
         totalTrades++;
         if(dp > 0) wins++;
         if(dTime >= dayStart) todayProfit += dp;
      }
   }

   double winRate = totalTrades > 0 ? (double)wins / totalTrades : 0.0;

   j += "  \"summary\": {" + nl;
   j += "    \"todayProfit\":  " + DoubleToStr2(todayProfit) + "," + nl;
   j += "    \"weekProfit\":   " + DoubleToStr2(weekProfit)  + "," + nl;
   j += "    \"drawdownPct\":  " + DoubleToStr2(ddPct)       + "," + nl;
   j += "    \"winRate\":      " + DoubleToStr2(winRate)      + "," + nl;
   j += "    \"totalTrades\":  " + IntegerToString(totalTrades) + nl;
   j += "  }" + nl;

   j += "}" + nl;
   return j;
}
