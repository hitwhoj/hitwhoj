import { Tabs } from "@arco-design/web-react";
import { useMatches, useNavigate } from "@remix-run/react";

const { TabPane } = Tabs;

type Props = {
  routes: {
    key: string;
    title: string;
  }[];
};

export function Navigator({ routes }: Props) {
  const navigate = useNavigate();
  const { pathname } = useMatches().at(-1)!;
  const currentTab =
    routes.filter((route) => pathname.indexOf(route.key) > -1).at(0)?.key ??
    ".";

  return (
    <Tabs onChange={(key) => navigate(key)} activeTab={currentTab}>
      {routes.map(({ key, title }) => (
        <TabPane key={key} title={title} />
      ))}
    </Tabs>
  );
}
