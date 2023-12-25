// pages/privacy-policy.tsx
import React from 'react';
import Head from 'next/head';
import styles from './PrivacyPolicy.module.css'; // CSS モジュールをインポート

export default function PrivacyPolicy({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const lang = searchParams.lang;
  const text = {
    jp: {
      title: "プライバシーポリシー - PP-Undo Plus",
      heading: "プライバシーポリシー",
      paragraph1: "PP-Undo Plus（以下、「当サービス」といいます。）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。",
      paragraph2: "当サービスの利用により収集される情報、その利用方法、および情報の保護について説明します。",
      collectionUse: {
        heading: "個人情報の収集と使用",
        paragraph1: "当サービスは、アカウント登録、サービス利用、お問い合わせ時に、名前、メールアドレス、連絡先情報などの個人情報を収集することがあります。",
        paragraph2: "収集した情報は、サービス提供、サポートの提供、ユーザー体験の向上などの目的で使用されます。"
      },
      informationSharing: {
        heading: "情報の共有と開示",
        paragraph1: "ユーザーの個人情報は、法的要請がある場合を除き、第三者と共有または開示されることはありません。"
      },
      informationProtection: {
        heading: "情報の保護",
        paragraph1: "当サービスは、ユーザーの個人情報を保護するために、適切な物理的、電子的な手段を講じています。"
      },
      userRights: {
        heading: "ユーザーの権利",
        paragraph1: "ユーザーは、いつでも自分の個人情報にアクセスし、訂正または削除を要求することができます。"
      },
      cookieTracking: {
        heading: "クッキーと追跡技術",
        paragraph1: "当サービスは、ユーザー体験の向上やサービスの分析のためにクッキーや追跡技術を使用することがあります。"
      },
      policyChanges: {
        heading: "プライバシーポリシーの変更",
        paragraph1: "当サービスは、必要に応じてプライバシーポリシーを更新することがあります。変更があった場合は、ウェブサイト上で通知します。"
      },
      contactInformation: {
        heading: "連絡先情報",
        paragraph1: "本プライバシーポリシーに関するお問い合わせは、以下のメールアドレスまでお願いします。",
        email: "yuutosekiguchi@gmail.com"
      }
    },
    en: {
      title: "Privacy Policy - PP-Undo Plus",
      heading: "Privacy Policy",
      paragraph1: "PP-Undo Plus (hereinafter referred to as 'the Service') respects the privacy of its users and is committed to protecting their personal information.",
      paragraph2: "This policy explains the information collected through the use of the Service, how it is used, and how it is protected.",
      collectionUse: {
        heading: "Collection and Use of Personal Information",
        paragraph1: "The Service may collect personal information such as names, email addresses, and contact details during account registration, service use, or inquiries.",
        paragraph2: "Collected information is used for purposes such as providing the Service, support, and improving user experience."
      },
      informationSharing: {
        heading: "Information Sharing and Disclosure",
        paragraph1: "User personal information will not be shared or disclosed to third parties, except as required by law."
      },
      informationProtection: {
        heading: "Information Protection",
        paragraph1: "The Service employs appropriate physical and electronic measures to protect users' personal information."
      },
      userRights: {
        heading: "User Rights",
        paragraph1: "Users have the right to access, correct, or request deletion of their personal information at any time."
      },
      cookieTracking: {
        heading: "Cookies and Tracking Technologies",
        paragraph1: "The Service may use cookies and tracking technologies to enhance user experience and analyze service usage."
      },
      policyChanges: {
        heading: "Changes to the Privacy Policy",
        paragraph1: "The Service reserves the right to update this privacy policy as necessary. Changes will be notified on the website."
      },
      contactInformation: {
        heading: "Contact Information",
        paragraph1: "For inquiries regarding this privacy policy, please contact us at the following email address:",
        email: "yuutosekiguchi@gmail.com"
      }
    }    
  };

  const currentText = lang === 'en' ? text.en : text.jp;

  return (
    <div className={styles.privacyPolicyContainer}>
      <Head>
        <title>{currentText.title}</title>
      </Head>
      <main className={styles.privacyPolicyContent}>
        <div className="flex items-center mb-12">
          <img
            src="/sidebar-logo.png"
            alt="logo"
            className="w-16 h-12"
          />
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
};
