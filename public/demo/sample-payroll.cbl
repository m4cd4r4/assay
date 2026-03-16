       IDENTIFICATION DIVISION.
       PROGRAM-ID. PAYROLL-CALC.
       AUTHOR. ASSAY-DEMO.
       DATE-WRITTEN. 2024-01-15.
      *
      * PAYROLL CALCULATION PROGRAM
      * Calculates gross pay, tax, and net pay for employees.
      * Reads employee master file and time records,
      * produces pay slips and updates payroll register.
      *
       ENVIRONMENT DIVISION.
       CONFIGURATION SECTION.
       SOURCE-COMPUTER. IBM-Z15.
       OBJECT-COMPUTER. IBM-Z15.
      *
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT EMPLOYEE-FILE ASSIGN TO EMPFILE
               ORGANIZATION IS INDEXED
               ACCESS MODE IS RANDOM
               RECORD KEY IS EMP-ID
               FILE STATUS IS WS-EMP-STATUS.
           SELECT TIME-FILE ASSIGN TO TIMEFILE
               ORGANIZATION IS SEQUENTIAL
               FILE STATUS IS WS-TIME-STATUS.
           SELECT PAYSLIP-FILE ASSIGN TO PAYSLIP
               ORGANIZATION IS SEQUENTIAL
               FILE STATUS IS WS-PAY-STATUS.
           SELECT ERROR-FILE ASSIGN TO ERRFILE
               ORGANIZATION IS SEQUENTIAL.
      *
       DATA DIVISION.
       FILE SECTION.
       FD  EMPLOYEE-FILE.
       01  EMPLOYEE-RECORD.
           05  EMP-ID              PIC 9(6).
           05  EMP-NAME            PIC X(30).
           05  EMP-DEPT            PIC X(4).
           05  EMP-PAY-RATE        PIC 9(4)V99.
           05  EMP-PAY-TYPE        PIC X(1).
               88  HOURLY          VALUE 'H'.
               88  SALARY          VALUE 'S'.
               88  CONTRACT        VALUE 'C'.
           05  EMP-TAX-CODE        PIC X(2).
           05  EMP-SUPER-RATE      PIC 9V99.
           05  EMP-YTD-GROSS       PIC 9(7)V99.
           05  EMP-YTD-TAX         PIC 9(7)V99.
           05  EMP-YTD-SUPER       PIC 9(7)V99.
           05  EMP-ACTIVE-FLAG     PIC X(1).
               88  EMP-ACTIVE      VALUE 'Y'.
               88  EMP-TERMINATED  VALUE 'T'.
               88  EMP-ON-LEAVE    VALUE 'L'.
      *
       FD  TIME-FILE.
       01  TIME-RECORD.
           05  TR-EMP-ID           PIC 9(6).
           05  TR-WEEK-ENDING      PIC 9(8).
           05  TR-HOURS-REGULAR    PIC 9(3)V9.
           05  TR-HOURS-OVERTIME   PIC 9(3)V9.
           05  TR-LEAVE-HOURS      PIC 9(3)V9.
           05  TR-SICK-HOURS       PIC 9(3)V9.
      *
       FD  PAYSLIP-FILE.
       01  PAYSLIP-RECORD          PIC X(200).
      *
       FD  ERROR-FILE.
       01  ERROR-RECORD            PIC X(120).
      *
       WORKING-STORAGE SECTION.
       COPY PAYROLL-CONSTANTS.
       COPY TAX-TABLES.
      *
       01  WS-FILE-STATUSES.
           05  WS-EMP-STATUS       PIC XX.
           05  WS-TIME-STATUS      PIC XX.
           05  WS-PAY-STATUS       PIC XX.
      *
       01  WS-SWITCHES.
           05  WS-EOF-TIME         PIC X(1) VALUE 'N'.
               88  END-OF-TIME     VALUE 'Y'.
           05  WS-ERROR-FLAG       PIC X(1) VALUE 'N'.
               88  PROCESSING-ERROR VALUE 'Y'.
      *
       01  WS-COUNTERS.
           05  WS-RECORDS-READ     PIC 9(6) VALUE ZERO.
           05  WS-RECORDS-PROCESSED PIC 9(6) VALUE ZERO.
           05  WS-RECORDS-ERROR    PIC 9(6) VALUE ZERO.
           05  WS-TOTAL-GROSS      PIC 9(9)V99 VALUE ZERO.
           05  WS-TOTAL-TAX        PIC 9(9)V99 VALUE ZERO.
           05  WS-TOTAL-NET        PIC 9(9)V99 VALUE ZERO.
      *
       01  WS-PAY-CALCULATION.
           05  WS-GROSS-PAY        PIC 9(7)V99.
           05  WS-REGULAR-PAY      PIC 9(7)V99.
           05  WS-OVERTIME-PAY     PIC 9(7)V99.
           05  WS-TAX-AMOUNT       PIC 9(7)V99.
           05  WS-SUPER-AMOUNT     PIC 9(7)V99.
           05  WS-NET-PAY          PIC 9(7)V99.
           05  WS-OVERTIME-RATE    PIC 9(4)V99.
      *
       01  WS-ERROR-MESSAGE        PIC X(80).
      *
       01  WS-CURRENT-DATE.
           05  WS-YEAR             PIC 9(4).
           05  WS-MONTH            PIC 9(2).
           05  WS-DAY              PIC 9(2).
      *
       PROCEDURE DIVISION.
       0000-MAIN-CONTROL.
           PERFORM 1000-INITIALIZE
           PERFORM 2000-PROCESS-PAYROLL
               UNTIL END-OF-TIME
           PERFORM 9000-FINALIZE
           STOP RUN.
      *
       1000-INITIALIZE.
           MOVE FUNCTION CURRENT-DATE TO WS-CURRENT-DATE
           OPEN INPUT EMPLOYEE-FILE
                      TIME-FILE
                OUTPUT PAYSLIP-FILE
                       ERROR-FILE
           IF WS-EMP-STATUS NOT = '00'
               DISPLAY 'ERROR OPENING EMPLOYEE FILE: ' WS-EMP-STATUS
               MOVE 'Y' TO WS-ERROR-FLAG
               STOP RUN
           END-IF
           PERFORM 2100-READ-TIME-RECORD.
      *
       2000-PROCESS-PAYROLL.
           ADD 1 TO WS-RECORDS-READ
           MOVE TR-EMP-ID TO EMP-ID
           READ EMPLOYEE-FILE
               INVALID KEY
                   PERFORM 8000-HANDLE-MISSING-EMPLOYEE
                   PERFORM 2100-READ-TIME-RECORD
                   EXIT PARAGRAPH
           END-READ
      *    Check employee is active
           IF NOT EMP-ACTIVE
               STRING 'EMPLOYEE ' TR-EMP-ID
                      ' IS NOT ACTIVE - STATUS: '
                      EMP-ACTIVE-FLAG
                      DELIMITED BY SIZE
                      INTO WS-ERROR-MESSAGE
               PERFORM 8100-WRITE-ERROR
               PERFORM 2100-READ-TIME-RECORD
               EXIT PARAGRAPH
           END-IF
      *    Calculate pay based on type
           EVALUATE TRUE
               WHEN HOURLY
                   PERFORM 3000-CALC-HOURLY-PAY
               WHEN SALARY
                   PERFORM 3100-CALC-SALARY-PAY
               WHEN CONTRACT
                   PERFORM 3200-CALC-CONTRACT-PAY
               WHEN OTHER
                   STRING 'UNKNOWN PAY TYPE: ' EMP-PAY-TYPE
                          ' FOR EMPLOYEE: ' TR-EMP-ID
                          DELIMITED BY SIZE
                          INTO WS-ERROR-MESSAGE
                   PERFORM 8100-WRITE-ERROR
                   PERFORM 2100-READ-TIME-RECORD
                   EXIT PARAGRAPH
           END-EVALUATE
      *    Calculate deductions
           PERFORM 4000-CALCULATE-TAX
           PERFORM 4100-CALCULATE-SUPER
      *    Calculate net pay
           COMPUTE WS-NET-PAY =
               WS-GROSS-PAY - WS-TAX-AMOUNT - WS-SUPER-AMOUNT
      *    Validate net pay is not negative
           IF WS-NET-PAY < ZERO
               STRING 'NEGATIVE NET PAY FOR EMPLOYEE: ' TR-EMP-ID
                      DELIMITED BY SIZE
                      INTO WS-ERROR-MESSAGE
               PERFORM 8100-WRITE-ERROR
               PERFORM 2100-READ-TIME-RECORD
               EXIT PARAGRAPH
           END-IF
      *    Update YTD totals
           PERFORM 5000-UPDATE-YTD
      *    Generate payslip
           PERFORM 6000-GENERATE-PAYSLIP
      *    Accumulate batch totals
           ADD WS-GROSS-PAY TO WS-TOTAL-GROSS
           ADD WS-TAX-AMOUNT TO WS-TOTAL-TAX
           ADD WS-NET-PAY TO WS-TOTAL-NET
           ADD 1 TO WS-RECORDS-PROCESSED
      *    Read next time record
           PERFORM 2100-READ-TIME-RECORD.
      *
       2100-READ-TIME-RECORD.
           READ TIME-FILE
               AT END
                   SET END-OF-TIME TO TRUE
           END-READ.
      *
       3000-CALC-HOURLY-PAY.
      *    Regular pay: hours * rate
           COMPUTE WS-REGULAR-PAY =
               TR-HOURS-REGULAR * EMP-PAY-RATE
      *    Overtime: 1.5x rate for first 10 hours, 2x after
           IF TR-HOURS-OVERTIME > 10
               COMPUTE WS-OVERTIME-PAY =
                   (10 * EMP-PAY-RATE * 1.5) +
                   ((TR-HOURS-OVERTIME - 10) * EMP-PAY-RATE * 2.0)
           ELSE
               COMPUTE WS-OVERTIME-PAY =
                   TR-HOURS-OVERTIME * EMP-PAY-RATE * 1.5
           END-IF
      *    Gross = regular + overtime
           COMPUTE WS-GROSS-PAY =
               WS-REGULAR-PAY + WS-OVERTIME-PAY.
      *
       3100-CALC-SALARY-PAY.
      *    Salary employees get weekly rate regardless of hours
      *    Weekly rate = annual / 52
           COMPUTE WS-GROSS-PAY =
               EMP-PAY-RATE * 100 / 52
           MOVE ZERO TO WS-OVERTIME-PAY.
      *
       3200-CALC-CONTRACT-PAY.
      *    Contractors paid hourly, no overtime loading
           COMPUTE WS-GROSS-PAY =
               (TR-HOURS-REGULAR + TR-HOURS-OVERTIME) * EMP-PAY-RATE
           MOVE ZERO TO WS-OVERTIME-PAY.
      *
       4000-CALCULATE-TAX.
      *    Australian PAYG withholding calculation
      *    Uses tax code to determine bracket
           EVALUATE EMP-TAX-CODE
               WHEN 'TF'
                   CALL 'TAX-CALC' USING WS-GROSS-PAY
                                         EMP-TAX-CODE
                                         WS-TAX-AMOUNT
               WHEN 'NT'
                   MOVE ZERO TO WS-TAX-AMOUNT
               WHEN 'FT'
                   COMPUTE WS-TAX-AMOUNT =
                       WS-GROSS-PAY * 0.32
               WHEN OTHER
                   COMPUTE WS-TAX-AMOUNT =
                       WS-GROSS-PAY * 0.47
           END-EVALUATE.
      *
       4100-CALCULATE-SUPER.
      *    Superannuation: employee rate * gross
      *    Minimum 11.5% per SG legislation 2024
           IF EMP-SUPER-RATE < 0.115
               COMPUTE WS-SUPER-AMOUNT =
                   WS-GROSS-PAY * 0.115
           ELSE
               COMPUTE WS-SUPER-AMOUNT =
                   WS-GROSS-PAY * EMP-SUPER-RATE
           END-IF.
      *
       5000-UPDATE-YTD.
           ADD WS-GROSS-PAY TO EMP-YTD-GROSS
           ADD WS-TAX-AMOUNT TO EMP-YTD-TAX
           ADD WS-SUPER-AMOUNT TO EMP-YTD-SUPER
           REWRITE EMPLOYEE-RECORD
               INVALID KEY
                   STRING 'REWRITE FAILED FOR: ' TR-EMP-ID
                          DELIMITED BY SIZE
                          INTO WS-ERROR-MESSAGE
                   PERFORM 8100-WRITE-ERROR.
      *
       6000-GENERATE-PAYSLIP.
           CALL 'PAYSLIP-FMT' USING EMPLOYEE-RECORD
                                     WS-PAY-CALCULATION
                                     PAYSLIP-RECORD
           WRITE PAYSLIP-RECORD.
      *
       8000-HANDLE-MISSING-EMPLOYEE.
           STRING 'EMPLOYEE NOT FOUND: ' TR-EMP-ID
                  DELIMITED BY SIZE
                  INTO WS-ERROR-MESSAGE
           PERFORM 8100-WRITE-ERROR
           ADD 1 TO WS-RECORDS-ERROR.
      *
       8100-WRITE-ERROR.
           WRITE ERROR-RECORD FROM WS-ERROR-MESSAGE
           ADD 1 TO WS-RECORDS-ERROR
           MOVE SPACES TO WS-ERROR-MESSAGE.
      *
       9000-FINALIZE.
           DISPLAY '=================================='
           DISPLAY 'PAYROLL PROCESSING COMPLETE'
           DISPLAY '=================================='
           DISPLAY 'RECORDS READ:      ' WS-RECORDS-READ
           DISPLAY 'RECORDS PROCESSED: ' WS-RECORDS-PROCESSED
           DISPLAY 'RECORDS IN ERROR:  ' WS-RECORDS-ERROR
           DISPLAY 'TOTAL GROSS PAY:   ' WS-TOTAL-GROSS
           DISPLAY 'TOTAL TAX:         ' WS-TOTAL-TAX
           DISPLAY 'TOTAL NET PAY:     ' WS-TOTAL-NET
           DISPLAY '=================================='
           CLOSE EMPLOYEE-FILE
                 TIME-FILE
                 PAYSLIP-FILE
                 ERROR-FILE.
