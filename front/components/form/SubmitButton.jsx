import { useFormikContext } from "formik";
import React from "react";

const SubmitButton = ({ children, ...rest }) => {
  const { handleSubmit } = useFormikContext() ?? {};

  return (
    <button
      className="btn btn-primary"
      type="submit"
      onClick={handleSubmit}
      {...rest}
    >
      {children}
    </button>
  );
};

export default SubmitButton;
