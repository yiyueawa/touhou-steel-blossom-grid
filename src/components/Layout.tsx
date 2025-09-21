import React from "react";
import { Layout as AntLayout, Select, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";

const { Header, Content, Footer } = AntLayout;
const { Title } = Typography;
const { Option } = Select;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Title
          level={3}
          style={{
            color: "white",
            margin: 0,
            background: "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("title")}
        </Title>

        <Space>
          <Select
            value={i18n.language}
            onChange={handleLanguageChange}
            style={{ width: 120 }}
            className="language-selector"
          >
            <Option value="zh">中文</Option>
            <Option value="ja">日本語</Option>
          </Select>
        </Space>
      </Header>

      <Content style={{ padding: "24px", flex: 1 }}>{children}</Content>

      <Footer
        style={{
          textAlign: "center",
          padding: "16px",
          backgroundColor: "#f5f5f5",
          borderTop: "1px solid #e8e8e8",
          marginTop: "auto",
        }}
      >
        <div style={{ color: "#666", lineHeight: "1.5" }}>
          <div>{t("footer.developedBy")}</div>
          <div style={{ fontSize: "12px", marginTop: "4px" }}>
            {t("footer.contact")}
          </div>
        </div>
      </Footer>
    </AntLayout>
  );
};

export default Layout;
