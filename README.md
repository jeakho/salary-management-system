# Solution Description
## Software Modules
The system consists of two modules corresponding to two real company departments: "hr" (Human Resources) and "accounting" (Accounting).

### Responsibilities of "hr"
1. Provide an API for managing company staff (adding and removing employees).

   a.) Assign managers to employees at all levels.
   
   b.) Set rules for salary calculation.
   
### Responsibilities of "accounting"
1. Provide an API for calculating:

    a.) Salary on a specified date for a specific employee.
   
    b.) Total salary sum of all company employees.
   
## Database
The database consists of two tables:

1. Employee table.
2. Relationship table between supervisor and subordinate.

### Employee Attributes
1. id
2. name
3. entranceDate (date when they joined the company)
4. baseSalary

### Relationship Attributes
1. id
2. staffMemberId - Employee ID
3. supervisorId - Supervisor Employee ID
4. path - Hierarchical path of the employee
5. pathDepth - Depth of the path in the hierarchy


# Advantages of the Solution
## By Modules:

1. The chosen division aligns with the natural departmental structure of companies, making the code more intuitive.
2. Clearly delineates departmental responsibilities.
   
## By Database:
1. Using path and supervisorId preserves the hierarchy of employee relationships in a simple format.
2. The path attribute optimizes querying subordinates at any level (used for calculating Sales salaries).
3. The supervisorId attribute optimizes querying first-level subordinates (used for calculating manager salaries).

## Future Development:

Introducing the concept of "salary calculation rule," which currently contains necessary attributes (baseSalary, coefficientPerYear, coefficientPerSubordinate, maxCoefficientOfBaseRate, subordinatesDepthLevel).


# Disadvantages of the Solution
1. The chosen solution works for a static data model and does not account for historical changes.
2. The path attribute will be lengthy with a deep hierarchy.
3. In the current task setup, the time to calculate salaries for Sales and Employee may significantly differ in large hierarchies, despite the current implementation caching already calculated salaries within the hierarchy.


# Further Development (Production)
1. Maintain a history of modifications for both employees and their relationships, as these will dynamically change over time.
2. To ensure relatively constant salary calculation times for different types of employees, additional tables may be needed to store pre-calculated salaries, with calculations triggered by system events.
3. In reality, salary calculation rules can be much more varied, and the interface for these rules and their application needs to be reconsidered.
4. Currently, only the business logic for salary calculation is covered by unit tests. In the future, all functional and integration requirements should be tested, and UI testing tools should be used when a UI is added.
5. Implement a procedure for building the application for different environments.
6. When using other DBMS systems, scripts for creating the required database objects and initializing them may be necessary.
7. Since the number of salary calculation rules is currently small, they are defined as static objects in the code. If the number of rules increases significantly, they can be stored in the database.
