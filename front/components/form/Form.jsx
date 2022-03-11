import React from "react";
import { Formik } from "formik";

function Form({
  initialValues,
  onSubmit,
  validationSchema,
  children,
  className = "",
}) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      className={className}
    >
      {() => children}
    </Formik>
  );
}

export default Form;
