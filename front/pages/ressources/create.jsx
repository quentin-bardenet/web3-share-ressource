import React from "react";
import RessourceForm from "./components/RessourceForm";

const createPage = () => {
  return (
    <div className="bg-base-200 rounded-xl p-4">
      <h2 className="text-4xl mb-4">Add new ressource</h2>
      <RessourceForm />
    </div>
  );
};

export default createPage;
