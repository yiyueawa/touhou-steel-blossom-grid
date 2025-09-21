import React from "react";
import { Layout as AntLayout, Select, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";

const { Header, Content } = AntLayout;
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

      <Content style={{ padding: "24px" }}>{children}</Content>
    </AntLayout>
  );
};

export default Layout;
