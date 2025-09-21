import React, { useState, useRef } from "react";
import {
  Card,
  Upload,
  Button,
  Typography,
  Row,
  Col,
  Image,
  Space,
  message,
  Spin,
} from "antd";
import { InboxOutlined, DownloadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import type { UploadFile } from "antd/es/upload/interface";
import { NineGridGenerator } from "../services/imageGenerator";
import CharacterPreview from "../components/CharacterPreview";

const { Title, Paragraph } = Typography;
const { Dragger } = Upload;

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState<string>("");
  const [resultImage, setResultImage] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const generatorRef = useRef<NineGridGenerator>(new NineGridGenerator());

  const handleUpload = async (file: File) => {
    // 文件大小检查
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      message.error(t("fileTooLarge"));
      return;
    }

    // 再次检查文件有效性
    if (!file || file.size === 0) {
      message.error(t("invalidFile"));
      return;
    }

    message.info(t("uploadStarted"));
    setProcessing(true);
    setProgress(0);
    setStatusText(t("statusReady"));

    try {
      // 使用文字状态回调
      const dataUrl = await generatorRef.current.generateNineGrid(
        file,
        (progress, status) => {
          setProgress(progress);
          setStatusText(t(status));
        }
      );

      // 检查生成结果
      if (!dataUrl || dataUrl.length < 100) {
        throw new Error("Generated image data is invalid");
      }

      setResultImage(dataUrl);
      message.success({
        content: t("uploadSuccess"),
        duration: 3,
        style: {
          marginTop: "20vh",
        },
      });
    } catch (error) {
      console.error("Processing error:", error);
      message.destroy();

      // 更详细的错误信息
      let errorMessage = t("uploadError");
      if (error instanceof Error) {
        if (error.message.includes("Failed to load image")) {
          errorMessage = t("imageLoadError");
        } else if (error.message.includes("Canvas")) {
          errorMessage = t("canvasError");
        } else if (error.message.includes("invalid")) {
          errorMessage = t("invalidImageData");
        }
      }

      message.error({
        content: errorMessage,
        duration: 5,
      });
    } finally {
      setProcessing(false);
      setTimeout(() => {
        setProgress(0);
        setStatusText("");
      }, 1500);
    }
  };

  const uploadProps = {
    accept: "image/*", // 明确指定只接受图片
    capture: false, // 允许选择照片来源（相机或相册）
    multiple: false, // 只允许上传一张图片
    beforeUpload: (file: File) => {
      console.log("File selected:", {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
      });

      // 检查文件是否存在
      if (!file) {
        message.error({
          content: t("noFileSelected"),
          duration: 3,
        });
        return false;
      }

      // 检查文件大小是否为0
      if (file.size === 0) {
        message.error({
          content: t("emptyFile"),
          duration: 3,
        });
        return false;
      }

      // 检查文件类型
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error({
          content: t("imageOnly"),
          duration: 3,
        });
        return false;
      }

      // 文件格式检查
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
        "image/tiff",
      ];

      if (file.type && !validTypes.includes(file.type)) {
        message.warning({
          content: t("formatWarning"),
          duration: 4,
        });
      }

      // 如果文件没有MIME类型（移动端拍照常见问题），尝试根据文件名判断
      if (!file.type && file.name) {
        const extension = file.name.toLowerCase().split(".").pop();
        const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp"];
        if (!extension || !imageExtensions.includes(extension)) {
          message.error({
            content: t("invalidFileExtension"),
            duration: 4,
          });
          return false;
        }
        message.info({
          content: t("mimeTypeDetected", { extension }),
          duration: 2,
        });
      }

      // 显示文件信息
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      message.info({
        content: t("fileInfo", { name: file.name, size: sizeInMB }),
        duration: 2,
      });

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
      try {
        const timestamp = new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/:/g, "-");
        const filename = `touhou_nine_grid_${timestamp}.jpg`;
        generatorRef.current.downloadImage(resultImage, filename);
        message.success({
          content: t("downloadSuccess"),
          duration: 2,
        });
      } catch (error) {
        message.error({
          content: t("downloadError"),
          duration: 3,
        });
      }
    } else {
      message.warning(t("noImageToDownload"));
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

            {processing && (
              <div style={{ marginTop: 16, textAlign: "center" }}>
                <div
                  style={{
                    padding: "16px",
                    background:
                      "linear-gradient(135deg, #f6f9ff 0%, #f1f5ff 100%)",
                    borderRadius: "8px",
                    border: "1px solid #e6f4ff",
                  }}
                >
                  <Spin size="small" style={{ marginRight: 8 }} />
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#1890ff",
                    }}
                  >
                    {statusText}
                  </span>
                  <div
                    style={{
                      marginTop: "8px",
                      fontSize: "12px",
                      color: "#666",
                      opacity: 0.8,
                    }}
                  >
                    {progress}% 完成
                  </div>
                </div>
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

      {/* 角色预览区域 */}
      <Row>
        <Col span={24}>
          <CharacterPreview />
        </Col>
      </Row>
    </div>
  );
};

export default Home;
