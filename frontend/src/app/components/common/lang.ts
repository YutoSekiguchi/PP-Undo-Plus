export class Lang {
  private lang: string;

  constructor(lang = "ja") {
    this.lang = lang;
  }

  nowLang() {
    return this.lang;
  }

  welcome() {
    return this.lang === "en" ? "Welcome" : "ようこそ";
  }

  tryDemo() {
    return this.lang === "en" ? "Try Demo" : "デモを試す";
  }

  start() {
    return this.lang === "en" ? "Start" : "開始";
  }

  newCollection() {
    return this.lang === "en" ? "New Collection" : "新規作成";
  }

  collectionName() {
    return this.lang === "en" ? "Collection Name" : "コレクション名";
  }

  add() {
    return this.lang === "en" ? "Add" : "追加";
  }

  delete() {
    return this.lang === "en" ? "Delete" : "削除する";
  }

  cancel() {
    return this.lang === "en" ? "Cancel" : "キャンセル";
  }

  create() {
    return this.lang === "en" ? "Create" : "作成";
  }

  myCollections() {
    return this.lang === "en" ? "My Collections" : "マイコレクション";
  }

  version() {
    return this.lang === "en" ? "Version" : "バージョン";
  }

  support() {
    return this.lang === "en" ? "Support" : "サポート";
  }

  prepare() {
    return this.lang === "en" ? "Prepare" : "準備中";
  }

  term() {
    return this.lang === "en" ? "Terms of Service" : "利用規約";
  }

  page() {
    return this.lang === "en" ? "Page" : "ページ";
  }

  termURL() {
    return this.lang === "en"
    ? "/terms?lang=en"
    : "/terms"
  }

  privacy() {
    return this.lang === "en" ? "Privacy Policy" : "プライバシーポリシー";
  }

  privacyURL() {
    return this.lang === "en"
    ? "/privacy-policy?lang=en"
    : "/privacy-policy"
  }

  contact() {
    return this.lang === "en" ? "Contact" : "お問い合わせ";
  }

  contactText() {
    return this.lang === "en"
      ? "For inquiries, please contact:"
      : "お問い合わせは以下までご連絡ください";
  }

  supportText() {
    return this.lang === "en"
      ? "For support, please visit:"
      : "サポートが必要な場合は、以下をご覧ください";
  }

  loginAgain() {
    return this.lang === "en"
      ? "Please login again"
      : "ログインし直してください";
  }

  failedToCreateNote() {
    return this.lang === "en"
      ? "Failed to create note"
      : "ノートの作成に失敗しました";
  }

  failedToSaveNote() {
    return this.lang === "en"
      ? "Failed to save note"
      : "ノートの保存に失敗しました";
  }

  failedToDeleteNote() {
    return this.lang === "en"
      ? "Failed to delete note"
      : "ノートの削除に失敗しました";
  }

  failedToDeleteCollection() {
    return this.lang === "en"
      ? "Failed to delete collection"
      : "コレクションの削除に失敗しました";
  }

  failedToUpdateCollectionTitle() {
    return this.lang === "en"
      ? "Failed to update collection title"
      : "コレクションタイトルの更新に失敗しました";
  }

  failedToUpdateNoteTitle() {
    return this.lang === "en"
      ? "Failed to update note title"
      : "ノートタイトルの更新に失敗しました";
  }

  confirmDeleteNote() {
    return this.lang === "en"
      ? "Are you sure you want to delete the selected notes?"
      : "選択したノートを削除してもよろしいですか？";
  }

  confirmDeleteCollection() {
    return this.lang === "en"
      ? "Are you sure you want to delete the selected collections?"
      : "選択したコレクションを削除してもよろしいですか？";
  }

  failedToMovePage() {
    return this.lang === "en"
      ? "Failed to move page"
      : "ページ移動に失敗しました";
  }

  collectionsURL() {
    return this.lang === "en"
    ? "/collections?lang=en"
    : "/collections"
  }

  loginWithGoogle() {
    return this.lang === "en" ? "Login with Google" : "Googleでログイン";
  }

  privacyPolicy() {
    return this.lang === "en"
      ? {
          title: "Privacy Policy - PP-Undo Plus",
          heading: "Privacy Policy",
          paragraph1:
            "PP-Undo Plus (hereinafter referred to as 'the Service') respects the privacy of its users and is committed to protecting their personal information.",
          paragraph2:
            "This policy explains the information collected through the use of the Service, how it is used, and how it is protected.",
          collectionUse: {
            heading: "Collection and Use of Personal Information",
            paragraph1:
              "The Service may collect personal information such as names, email addresses, and contact details during account registration, service use, or inquiries.",
            paragraph2:
              "Collected information is used for purposes such as providing the Service, support, and improving user experience.",
          },
          informationSharing: {
            heading: "Information Sharing and Disclosure",
            paragraph1:
              "User personal information will not be shared or disclosed to third parties, except as required by law.",
          },
          informationProtection: {
            heading: "Information Protection",
            paragraph1:
              "The Service employs appropriate physical and electronic measures to protect users' personal information.",
          },
          userRights: {
            heading: "User Rights",
            paragraph1:
              "Users have the right to access, correct, or request deletion of their personal information at any time.",
          },
          cookieTracking: {
            heading: "Cookies and Tracking Technologies",
            paragraph1:
              "The Service may use cookies and tracking technologies to enhance user experience and analyze service usage.",
          },
          policyChanges: {
            heading: "Changes to the Privacy Policy",
            paragraph1:
              "The Service reserves the right to update this privacy policy as necessary. Changes will be notified on the website.",
          },
          contactInformation: {
            heading: "Contact Information",
            paragraph1:
              "For inquiries regarding this privacy policy, please contact us at the following email address:",
            email: "yuutosekiguchi@gmail.com",
          },
        }
      : {
          title: "プライバシーポリシー - PP-Undo Plus",
          heading: "プライバシーポリシー",
          paragraph1:
            "PP-Undo Plus（以下、「当サービス」といいます。）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。",
          paragraph2:
            "当サービスの利用により収集される情報、その利用方法、および情報の保護について説明します。",
          collectionUse: {
            heading: "個人情報の収集と使用",
            paragraph1:
              "当サービスは、アカウント登録、サービス利用、お問い合わせ時に、名前、メールアドレス、連絡先情報などの個人情報を収集することがあります。",
            paragraph2:
              "収集した情報は、サービス提供、サポートの提供、ユーザー体験の向上などの目的で使用されます。",
          },
          informationSharing: {
            heading: "情報の共有と開示",
            paragraph1:
              "ユーザーの個人情報は、法的要請がある場合を除き、第三者と共有または開示されることはありません。",
          },
          informationProtection: {
            heading: "情報の保護",
            paragraph1:
              "当サービスは、ユーザーの個人情報を保護するために、適切な物理的、電子的な手段を講じています。",
          },
          userRights: {
            heading: "ユーザーの権利",
            paragraph1:
              "ユーザーは、いつでも自分の個人情報にアクセスし、訂正または削除を要求することができます。",
          },
          cookieTracking: {
            heading: "クッキーと追跡技術",
            paragraph1:
              "当サービスは、ユーザー体験の向上やサービスの分析のためにクッキーや追跡技術を使用することがあります。",
          },
          policyChanges: {
            heading: "プライバシーポリシーの変更",
            paragraph1:
              "当サービスは、必要に応じてプライバシーポリシーを更新することがあります。変更があった場合は、ウェブサイト上で通知します。",
          },
          contactInformation: {
            heading: "連絡先情報",
            paragraph1:
              "本プライバシーポリシーに関するお問い合わせは、以下のメールアドレスまでお願いします。",
            email: "yuutosekiguchi@gmail.com",
          },
        };
  }
}
