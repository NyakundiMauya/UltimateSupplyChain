import express from 'express';
import Employee from '../models/Employee.js'; // Ensure this path is correct
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Add this line at the beginning of the file, after the importsS
console.log("JWT_SECRET:", process.env.JWT_SECRET);

// Login endpoint for employees
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Attempting login for email:', email);
        
        // Fetch the employee by email
        const employee = await Employee.findOne({ email }).select('+password');
        if (!employee) {
            console.log('No employee found for email:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('Employee found:', employee._id);

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            console.log('Password mismatch for email:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('Password matched for email:', email);

        // Generate a token
        const token = jwt.sign(
            { id: employee._id, role: employee.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Remove password before sending response
        employee.password = undefined;

        console.log('Login successful for email:', email);
        res.status(200).json({ token, employee });
    } catch (error) {
        console.error('Login error:', error);
        console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        res.status(500).json({ 
            error: 'An unexpected error occurred', 
            details: error.message,
            stack: error.stack
        });
    }
});


// Signup endpoint for new employees
router.post('/signup', async (req, res) => {
    const { name, email, password, role, category, salary, phoneNumber, branch, position } = req.body;

    try {
        // Check if the employee already exists
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            console.log(`Signup attempt with existing email: ${email}`);
            return res.status(400).json({ error: 'Employee already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new employee object with hashed password
        const newEmployee = new Employee({
            name,
            email,
            password: hashedPassword,
            role,
            category,
            salary,
            phoneNumber,
            branch,
            position,
        });

        // Save the employee to the database
        await newEmployee.save();

        // Generate a token
        const token = jwt.sign(
            { id: newEmployee._id, role: newEmployee.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Remove sensitive data before sending the response
        newEmployee.password = undefined;

        console.log(`New employee created: ${newEmployee._id} (${newEmployee.email})`);
        res.status(201).json({ token, employee: newEmployee });
    } catch (error) {
        console.error('Signup error:', error);
        // Log more details about the error
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            // Log the request body (excluding password)
            requestBody: { ...req.body, password: '[REDACTED]' }
        });
        res.status(500).json({ 
            error: 'An unexpected error occurred', 
            details: error.message 
        });
    }
});


// Get all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find({});
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single employee by ID
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new employee
router.post('/', async (req, res) => {
    const { name, email, password, role, category, phoneNumber, branch, position, salary } = req.body;

    try {
        // Check if the employee already exists
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            console.log(`Create attempt with existing email: ${email}`);
            return res.status(400).json({ error: 'Employee already exists' });
        }

        // Create a new employee object
        const newEmployee = new Employee({
            name,
            email,
            password,
            role,
            category,
            phoneNumber,
            branch,
            position,  // Add the position field
            salary,    // Add the salary field
        });

        // Save the employee to the database
        await newEmployee.save();

        // Remove sensitive data before sending the response
        newEmployee.password = undefined;

        console.log(`New employee created: ${newEmployee._id} (${newEmployee.email})`);
        res.status(201).json({ employee: newEmployee });
    } catch (error) {
        console.error('Create employee error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            requestBody: { ...req.body, password: '[REDACTED]' }
        });
        res.status(500).json({ 
            error: 'An unexpected error occurred', 
            details: error.message 
        });
    }
});

// Update an employee
router.put('/:id', async (req, res) => {
    try {
        const { password, ...updateData } = req.body;

        // If password is being updated, hash it
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete an employee
router.delete('/:id', async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
