import React from "react";
import { ConfigProvider, App as AntApp } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import zhCN from "antd/locale/zh_CN";
import jaJP from "antd/locale/ja_JP";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import "./App.css";
import "./i18n";

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
