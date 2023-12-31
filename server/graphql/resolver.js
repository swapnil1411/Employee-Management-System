const Employee = require("../models/employees.js");

const moment = require("moment");

const resolvers = {
  Query: {
    getEmployees: async (_root, { limitValue, offset }) => {
      return await Employee.find({})
        .limit(parseInt(limitValue))
        .skip(parseInt(offset));
    },
    getEmployee: async (_root, { id }) => {
      return await Employee.findById(id);
    },
    searchEmployees: async (_root, args) => {
      const name = args.name;
      console.log(name);
      if (!name) {
        return 0;
      }

      const Employees = await Employee.find({
        FirstName: { $regex: name, $options: "i" },
      });
      console.log(Employees);
      if (!Employees) {
        throw new Error("Employee not found");
      }

      return Employees;
    },
    filterEmployees: async (_root, args) => {
      const type = args.type;
      console.log(type);
      if (!type) {
        return 0;
      }

      const Employees = await Employee.find({
        EmployeeType: { $regex: type, $options: "i" },
      });
      console.log(Employees);
      if (!Employees) {
        throw new Error("Employee not found");
      }

      return Employees;
    },
  },
  Mutation: {
    createEmployee: async (_root, args) => {
      const {
        FirstName,
        LastName,
        Age,
        DateOfJoining,
        Title,
        Department,
        EmployeeType,
      } = args;

      const employeeData = new Employee({
        FirstName: FirstName,
        LastName: LastName,
        Age: Age,
        DateOfJoining: moment(DateOfJoining),
        Title: Title,
        Department: Department,
        EmployeeType: EmployeeType,
      });
      await employeeData.save();

      return employeeData;
    },
    updateEmployee: async (_root, args) => {
      const { id, ...updateData } = args;

     

      // Find the employee by ID and update their data
      const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, {
        new: true, // Return the updated document
        runValidators: true, // Run Mongoose validators
      });

      if (!updatedEmployee) {
        throw new Error("Employee not found");
      }
      const data = new Employee(updatedEmployee);
      return data;
    },

    deleteEmployee: async (_root, args) => {
      const { id } = args;

      // Use Moment.js to parse the updated DateOfJoining string if it's provided
      if (!id) {
        return "Error from server side";
      }

      // Find the employee by ID and update their data
      const deletedEmployee = await Employee.findByIdAndDelete(id, {
        new: true, // Return the updated document
        runValidators: true, // Run Mongoose validators
      });

      if (!deletedEmployee) {
        throw new Error("Employee not found");
      }

      return "Delete Done";
    },
  },
};

module.exports = resolvers;
