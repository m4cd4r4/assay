      * PAYROLL-CONSTANTS.cpy
      * Shared constants for payroll processing
      *
       01  WS-PAYROLL-CONSTANTS.
           05  WS-MAX-REGULAR-HOURS  PIC 9(3)V9 VALUE 38.0.
           05  WS-OVERTIME-RATE-1    PIC 9V99    VALUE 1.50.
           05  WS-OVERTIME-RATE-2    PIC 9V99    VALUE 2.00.
           05  WS-OT-THRESHOLD      PIC 9(3)    VALUE 10.
           05  WS-MIN-SUPER-RATE    PIC 9V999   VALUE 0.115.
           05  WS-MAX-SUPER-BASE    PIC 9(7)V99 VALUE 62270.00.
           05  WS-WEEKS-PER-YEAR    PIC 99      VALUE 52.
           05  WS-PAY-RUN-DATE      PIC 9(8)    VALUE ZERO.
           05  WS-PAY-PERIOD        PIC X(1)    VALUE 'W'.
               88  WEEKLY           VALUE 'W'.
               88  FORTNIGHTLY      VALUE 'F'.
               88  MONTHLY          VALUE 'M'.
