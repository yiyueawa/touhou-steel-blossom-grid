import React from "react";
import { Card, Typography, Row, Col, Image, Space } from "antd";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

interface CharacterPreviewProps {
  onImageLoad?: () => void;
}

const CharacterPreview: React.FC<CharacterPreviewProps> = ({ onImageLoad }) => {
  const { t } = useTranslation();

  const characterImages = [
    { name: "恋", filename: "恋.jpg" },
    { name: "求", filename: "求.jpg" },
    { name: "沙", filename: "沙.jpg" },
    { name: "猫", filename: "猫.jpg" },
    { name: "紫", filename: "紫.jpg" },
    { name: "芙", filename: "芙.jpg" },
    { name: "花", filename: "花.jpg" },
    { name: "谁？", filename: "谁？.jpg" },
  ];

  return (
    <Card
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            {t("characterGallery")}
          </Title>
          <Text type="secondary">
            ({characterImages.length} {t("characters")})
          </Text>
        </Space>
      }
      className="hover-card"
      style={{ marginTop: 24 }}
    >
      <Row gutter={[12, 12]}>
        {characterImages.map((character, index) => (
          <Col xs={6} sm={4} md={3} key={index}>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 8,
                aspectRatio: "1",
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              }}
            >
              <Image
                src={`/images/${character.filename}`}
                alt={character.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                preview={{
                  mask: (
                    <div style={{ fontSize: 12, fontWeight: "bold" }}>
                      {character.name}
                    </div>
                  ),
                }}
                onLoad={onImageLoad}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
              />
            </div>
          </Col>
        ))}
      </Row>
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {t("characterDescription")}
        </Text>
      </div>
    </Card>
  );
};

export default CharacterPreview;
