import React from 'react';
import Head from 'next/head';
import './style.css';

export default function Terms({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const lang = searchParams.lang;
  const text = {
    jp: {
      title: "利用規約 - PP-Undo Plus",
      heading: "利用規約",
      section1: {
        heading: "1. 総則",
        paragraph1: "本利用規約（以下、「本規約」といいます。）は、PP-Undo Plus（以下、「当サービス」といいます。）の利用条件を定めるものです。ユーザーは、本規約に同意の上、当サービスを利用するものとします。",
      },
      section2: {
        heading: "2. アカウント登録",
        paragraph1: "当サービスの一部機能を利用するためには、アカウント登録が必要です。ユーザーは、真実かつ正確な情報を提供し、常に最新の情報を維持する責任を負います。",
      },
      section3: {
        heading: "3. 手書きデータの取得と利用",
        paragraph1: "当サービスでは、ユーザーが提供する手書きデータ（文字、図形、その他の手書き情報）を取得し、サービスの機能向上のために利用することがあります。これには以下の目的が含まれます：",
        list1: [
          "手書きデータの分析と改善",
          "新機能の開発",
          "ユーザーエクスペリエンスの向上",
        ],
        paragraph2: "また、ユーザーの同意を得た場合に限り、手書きデータを研究、展示、教育目的などのために公開することがあります。当サービスは、ユーザーの手書きデータを厳格に保護し、ユーザーの同意なく第三者に開示または提供しません。",
      },
      section4: {
        heading: "4. 禁止事項",
        paragraph1: "ユーザーは、以下の行為をしてはならないものとします：",
        list1: [
          "法令または公序良俗に違反する行為",
          "犯罪行為に関連する行為",
          "当サービスの運営を妨げる行為",
          "他のユーザーに迷惑をかける行為",
          "その他、当社が不適切と判断する行為",
        ],
      },
      section5: {
        heading: "5. 免責事項",
        paragraph1: "当社は、当サービスの運営に関して、技術上または理論上の完全性、正確性、安全性などを保証するものではありません。当サービス利用によるいかなる損害についても、当社は責任を負わないものとします。",
      },
      section6: {
        heading: "6. 利用規約の変更",
        paragraph1: "当社は、必要に応じて本規約を変更することができるものとします。変更後の利用規約は、当サービス上に表示された時点で効力を生じるものとします。",
      },
      section7: {
        heading: "7. 連絡先",
        paragraph1: "本規約に関するお問い合わせは、以下の連絡先までお願いします。",
        paragraph2: "Email:yuutosekiguchi@gmail.com"
      }
    },
    en: {
      title: "Terms of Service - PP-Undo Plus",
      heading: "Terms of Service",
      section1: {
        heading: "1. General Provisions",
        paragraph1: "These Terms of Service (hereinafter referred to as 'Terms') govern the use of PP-Undo Plus (hereinafter referred to as 'the Service'). By using the Service, users agree to abide by these Terms."
      },
      section2: {
        heading: "2. Account Registration",
        paragraph1: "Registration of an account is required to use certain features of the Service. Users are responsible for providing true and accurate information and maintaining the up-to-dateness of such information."
      },
      section3: {
        heading: "3. Collection and Use of Handwritten Data",
        paragraph1: "The Service may collect handwritten data (including text, drawings, and other forms of handwritten information) provided by users to enhance the functionality of the Service. This includes, but is not limited to:",
        list1: [
          "Analysis and improvement of handwritten data",
          "Development of new features",
          "Enhancing user experience"
        ],
        paragraph2: "Furthermore, with the user's consent, the Service may publish handwritten data for research, exhibition, or educational purposes. The Service will strictly protect user's handwritten data and will not disclose or provide it to third parties without the user's consent."
      },
      section4: {
        heading: "4. Prohibited Actions",
        paragraph1: "Users must not engage in the following actions:",
        list1: [
          "Acts that violate laws or public order and morals",
          "Acts related to criminal activity",
          "Acts that hinder the operation of the Service",
          "Acts that cause inconvenience to other users",
          "Other acts deemed inappropriate by the company"
        ],
      },
      section5: {
        heading: "5. Disclaimer",
        paragraph1: "The company does not guarantee the technical or theoretical completeness, accuracy, or safety of the Service's operation. The company is not liable for any damages arising from the use of the Service."
      },
      section6: {
        heading: "6. Changes to the Terms of Service",
        paragraph1: "The company may modify these Terms as necessary. The modified Terms will take effect upon their display on the Service."
      },
      section7: {
        heading: "7. Contact Information",
        paragraph1: "For inquiries regarding these Terms, please contact us at the following address:",
        paragraph2: "Email: yuutosekiguchi@gmail.com"
      }
    }    
  }

  const currentText = lang === "en"? text.en : text.jp;

  return (
    <div className="terms-container">
      <Head>
        <title>{currentText.title}</title>
      </Head>
      <main className="terms-content">
        <div className="flex items-center mb-12">
          <img
            src="/sidebar-logo.png"
            alt="logo"
            className="w-16 h-12"
          />
          <h1>{currentText.heading}</h1>
        </div>
        <section>
          <h2>{currentText.section1.heading}</h2>
          <p>{currentText.section1.paragraph1}</p>
        </section>
        <section>
          <h2>{currentText.section2.heading}</h2>
          <p>{currentText.section2.paragraph1}</p>
        </section>
        <section>
          <h2>{currentText.section3.heading}</h2>
          <p>{currentText.section3.paragraph1}</p>
          <ul>
            {currentText.section3.list1.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p>{currentText.section3.paragraph2}</p>
        </section>
        <section>
          <h2>{currentText.section4.heading}</h2>
          <p>{currentText.section4.paragraph1}</p>
          <ul>
            {currentText.section4.list1.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>{currentText.section5.heading}</h2>
          <p>{currentText.section5.paragraph1}</p>
        </section>
        <section>
          <h2>{currentText.section6.heading}</h2>
          <p>{currentText.section6.paragraph1}</p>
        </section>
        <section>
          <h2>{currentText.section7.heading}</h2>
          <p>{currentText.section7.paragraph1}</p>
          <p>{currentText.section7.paragraph2}</p>
        </section>
      </main>
    </div>
  );
};
