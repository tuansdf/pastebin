import { LinkHistory } from "@/client/components/links/link-history";
import { Title } from "@mantine/core";

export default function Page() {
  return (
    <>
      <Title mb="md" size="h3">
        URL history
      </Title>

      <LinkHistory />
    </>
  );
}
