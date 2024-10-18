import mongoose from 'mongoose';

const StoreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, default: '' },
    },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /\+?\d{7,15}/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`,
      },
    },
    manager: {
      name: { type: String, required: true, trim: true },
      email: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            return /^\S+@\S+\.\S+$/.test(v);
          },
          message: props => `${props.value} is not a valid email address!`,
        },
      },
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'under maintenance'],
      default: 'closed',
    },
    branch: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[A-Z]{3}\d{3}$/.test(v);
        },
        message: props => `${props.value} is not a valid branch code!`,
      },
    },
  },
  { timestamps: true }
);

const Store = mongoose.model('Store', StoreSchema);

export default Store;
