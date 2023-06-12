import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "What it does",
    Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
    description: (
      <>
        Revolutionize Insurance with Secured, Tested & Automated Contracts. By
        seamlessly integrating our library into your organization's systems, you
        can automate the generation and management of insurance contracts,
        saving time and boosting efficiency.
      </>
    ),
  },
  {
    title: "Seamless Integration with External Systems",
    Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
    description: (
      <>
        Bridge the gap between insurance contracts and external systems
        effortlessly! Our library enables easy API calls via Chainlink, allowing
        you to access and integrate data from various sources.
      </>
    ),
  },
  {
    title: "Customizable and Tailored to Your Needs",
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: (
      <>
        Our library offers unparalleled flexibility! You have full control to
        override virtual functions and adapt the insurance contract process to
        fit your unique business requirements
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
