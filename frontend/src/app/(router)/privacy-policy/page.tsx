// pages/privacy-policy.tsx
import React from "react";
import Head from "next/head";
import styles from "./PrivacyPolicy.module.css"; // CSS モジュールをインポート
import Image from "next/image";
import { Lang } from "@/app/components/common/lang";

export default function PrivacyPolicy({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const lang =
    searchParams.lang === undefined || Array.isArray(searchParams.lang)
      ? new Lang()
      : new Lang(searchParams.lang);
  const currentText = lang.privacyPolicy();

  return (
    <div className={styles.privacyPolicyContainer}>
      <Head>
        <title>{currentText.title}</title>
      </Head>
      <main className={styles.privacyPolicyContent}>
        <div className="flex items-center mb-12">
          <Image src="/sidebar-logo.png" width={64} height={48} alt="logo" />
          <h1>{currentText.heading}</h1>
        </div>
        <p>{currentText.paragraph1}</p>
        <p>{currentText.paragraph2}</p>

        <h2>{currentText.collectionUse.heading}</h2>
        <p>{currentText.collectionUse.paragraph1}</p>
        <p>{currentText.collectionUse.paragraph2}</p>

        <h2>{currentText.informationSharing.heading}</h2>
        <p>{currentText.informationSharing.paragraph1}</p>

        <h2>{currentText.informationProtection.heading}</h2>
        <p>{currentText.informationProtection.paragraph1}</p>

        <h2>{currentText.userRights.heading}</h2>
        <p>{currentText.userRights.paragraph1}</p>

        <h2>{currentText.cookieTracking.heading}</h2>
        <p>{currentText.cookieTracking.paragraph1}</p>

        <h2>{currentText.policyChanges.heading}</h2>
        <p>{currentText.policyChanges.paragraph1}</p>

        <h2>{currentText.contactInformation.heading}</h2>
        <p>{currentText.contactInformation.paragraph1}</p>
        <p>{currentText.contactInformation.email}</p>
      </main>
    </div>
  );
}
