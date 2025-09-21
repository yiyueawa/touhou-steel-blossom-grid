import { ConfigProvider, App as AntApp, message } from "antd";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import zhCN from "antd/locale/zh_CN";
import jaJP from "antd/locale/ja_JP";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import "./App.css";
import "./i18n";

// 配置全局message设置
message.config({
  maxCount: 3, // 最多显示3个消息（避免界面过于拥挤）
  duration: 3, // 每个消息显示3秒
  top: 80, // 距离顶部80px（避免与header重叠）
  rtl: false, // 从左到右
});

function App() {
  const { i18n } = useTranslation();
  const locale = i18n.language === "ja" ? jaJP : zhCN;

  return (
    <ConfigProvider locale={locale}>
      <AntApp>
        <Router>
          <div className="app-container">
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            </Layout>
          </div>
        </Router>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
