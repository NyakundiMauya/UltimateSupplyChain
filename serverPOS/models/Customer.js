import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      // validate: {
      //   validator: function(v) {
      //     return /^[a-zA-Z]+$/.test(v);
      //   },
      //   message: props => `${props.value} is not a valid name. Name should be a single word with no spaces or numbers.`
      // }
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // validate: {
      //   validator: function(v) {
      //     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      //   },
      //   message: props => `${props.value} is not a valid email address.`
      // }
    },
    phoneNumber: {
      type: String,
      required: true,
      // validate: {
      //   validator: function(v) {
      //     return /^\d{10}$/.test(v);
      //   },
      //   message: props => `${props.value} is not a valid phone number. It should be 10 digits.`
      // }
    },
    country: {
      type: String,
      required: true,
      enum: [
        { code: 'KE', name: 'Kenya' },
        { code: 'TZ', name: 'Tanzania' }
      ],
      // validate: {
      //   validator: function(v) {
      //     return this.schema.path('country').enumValues.some(country => country.code === v);
      //   },
      //   message: props => `${props.value} is not a valid country code. Only KE (Kenya) or TZ (Tanzania) are allowed.`
      // }
    },
    password: {
      type: String,
      required: true,
      // validate: {
      //   validator: function(v) {
      //     // Password should be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character
      //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
      //   },
      //   message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      // }
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin']
    }
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", CustomerSchema);

export default Customer;
