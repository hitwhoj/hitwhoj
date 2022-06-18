import { Button, Typography } from "@arco-design/web-react";
import { Link } from "@remix-run/react";

export default function TeamSettings() {
  return (
    <Typography>
      <Typography.Title heading={4}>危险区域</Typography.Title>
      <Typography.Paragraph>
        <Link to="dissolve">
          <Button type="primary" status="danger">
            解散团队...
          </Button>
        </Link>
      </Typography.Paragraph>
    </Typography>
  );
}
