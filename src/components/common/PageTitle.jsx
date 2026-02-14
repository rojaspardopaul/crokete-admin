import React from "react";
import { Helmet } from "react-helmet";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const PageTitle = ({ title, description }) => {
  const { shopName } = useUtilsFunction();
  
  return (
    <Helmet>
      <title>
        {" "}
        {title
          ? `${title} | ${shopName} Admin Dashboard`
          : `${shopName} | React eCommerce Admin Dashboard`}
      </title>
      <meta
        name="description"
        content={
          description
            ? ` ${description} `
            : `${shopName} : React Grocery & Organic Food Store e-commerce Admin Dashboard`
        }
      />
    </Helmet>
  );
};

export default PageTitle;
