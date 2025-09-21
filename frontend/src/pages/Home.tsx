import React, { useState } from "react";
import {
  Card,
  Upload,
  Button,
  Typography,
  Row,
  Col,
  Progress,
  Image,
  Space,
  message,
  Spin,
} from "antd";
import { InboxOutlined, DownloadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import type { UploadFile } from "antd/es/upload/interface";

const { Title, Paragraph } = Typography;
const { Dragger } = Upload;

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultImage, setResultImage] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5001/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setResultImage(
          `http://localhost:5001/static/results/${result.filename}`
        );
        message.success(t("uploadSuccess"));
      } else {
        message.error(t("uploadError"));
      }
    } catch (error) {
      console.error("Upload error:", error);
      message.error(t("uploadError"));
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error(t("imageOnly"));
        return false;
      }
      handleUpload(file);
      return false;
    },
    fileList,
    onChange: ({ fileList }: { fileList: UploadFile[] }) => {
      setFileList(fileList);
    },
    showUploadList: false,
  };

  const downloadImage = () => {
    if (resultImage) {
      const link = document.createElement("a");
      link.href = resultImage;
      link.download = "touhou_nine_grid.jpg";
      link.click();
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card
            className="hover-card"
            style={{ textAlign: "center", marginBottom: 24 }}
          >
            <Title level={2} className="gradient-text">
              {t("welcome")}
            </Title>
            <Paragraph style={{ fontSize: 16, marginBottom: 0 }}>
              {t("description")}
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={t("uploadTitle")}
            className="hover-card upload-container"
          >
            <Dragger {...uploadProps} style={{ marginBottom: 16 }}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ fontSize: 48, color: "#6f42c1" }} />
              </p>
              <p
                className="ant-upload-text"
                style={{ fontSize: 16, fontWeight: "bold" }}
              >
                {t("uploadText")}
              </p>
              <p className="ant-upload-hint">{t("uploadHint")}</p>
            </Dragger>

            {uploading && (
              <div style={{ marginTop: 16 }}>
                <Progress
                  percent={progress}
                  status="active"
                  strokeColor={{
                    "0%": "#6f42c1",
                    "100%": "#e83e8c",
                  }}
                  className="progress-animated"
                />
                <p style={{ textAlign: "center", marginTop: 8 }}>
                  <Spin size="small" /> {t("processing")}
                </p>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title={t("previewTitle")} className="hover-card">
            {resultImage ? (
              <Space direction="vertical" style={{ width: "100%" }}>
                <Image
                  src={resultImage}
                  alt="Nine Grid Result"
                  style={{ width: "100%", borderRadius: 8 }}
                  className="result-image"
                />
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={downloadImage}
                  style={{
                    background:
                      "linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)",
                    border: "none",
                    width: "100%",
                  }}
                >
                  {t("download")}
                </Button>
              </Space>
            ) : (
              <div
                style={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                  borderRadius: 8,
                  border: "2px dashed #d9d9d9",
                }}
              >
                <Typography.Text type="secondary" style={{ fontSize: 16 }}>
                  {t("noImage")}
                </Typography.Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
