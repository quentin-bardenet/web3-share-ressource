import React from "react";
import * as Yup from "yup";
import { useRouter } from "next/dist/client/router";
import { ethers } from "ethers";

import Form from "../../../components/form/Form";
import Input from "../../../components/form/Input";
import SubmitButton from "../../../components/form/SubmitButton";
import TextArea from "../../../components/form/TextArea";

import Web3Ressources from "../../../artifacts/Web3Ressources.json";

const validationSchema = Yup.object().shape({
  ressource: Yup.string().required("Please enter ressource url"),
  comment: Yup.string().required("Please set a comment"),
});

const RessourceForm = () => {
  const router = useRouter();

  const onSubmit = async (values) => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDR,
        Web3Ressources.abi,
        signer
      );

      try {
        await contract.addRessource(values.ressource, values.comment);
        router.push("/");
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{ ressource: "", comment: "" }}
      validationSchema={validationSchema}
    >
      <Input name="ressource" placeholder="Ressource url..." />
      <TextArea name="comment" placeholder="Comment..."></TextArea>
      <SubmitButton>Send</SubmitButton>
    </Form>
  );
};

export default RessourceForm;
