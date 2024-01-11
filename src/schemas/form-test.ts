import Joi from "joi";

export const contactSchema = Joi.object({
    firstName: Joi.string()
      .max(15, 'Must be 15 characters or less')
      .required(),
  
    lastName: Joi.string()
      .max(20, 'Must be 20 characters or less')
      .required(),
  
    email: Joi.string().email().required(),
  })
  