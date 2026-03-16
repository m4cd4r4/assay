      * TAX-TABLES.cpy
      * Australian PAYG tax withholding brackets 2024-25
      *
       01  WS-TAX-TABLES.
           05  WS-TAX-BRACKET OCCURS 5 TIMES.
               10  WS-BRACKET-MIN    PIC 9(7)V99.
               10  WS-BRACKET-MAX    PIC 9(7)V99.
               10  WS-BRACKET-RATE   PIC 9V9999.
               10  WS-BRACKET-BASE   PIC 9(7)V99.
      *
       01  WS-TAX-CODES.
           05  WS-VALID-TAX-CODE    PIC X(2) OCCURS 6 TIMES.
      *        TF = Tax Free Threshold claimed
      *        NT = No Tax (exempt)
      *        FT = Foreign Tax resident (flat rate)
      *        HH = HELP/HECS debt
      *        ML = Medicare Levy
      *        SF = Super Fund (over 60)
