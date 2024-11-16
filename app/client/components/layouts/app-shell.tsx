import { useDisclosure } from "@/client/hooks/use-disclosure";
import { AppShell as MAppShell, Box, Burger, Container, Drawer, NavLink } from "@mantine/core";
import { Link, useLocation } from "@remix-run/react";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export const AppShell = ({ children }: Props) => {
  const location = useLocation();
  const pathname = location.pathname;
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <MAppShell header={{ height: 52 }} padding="md">
      <MAppShell.Header className="k-header">
        <Burger opened={opened} onClick={toggle} size="sm" />
        <div>Pastebin</div>
      </MAppShell.Header>

      <Drawer opened={opened} onClose={close} title="Pastebin">
        <Box>
          <NavLink
            to="/create-note"
            label="Create a note"
            component={Link}
            active={pathname === "/create-note"}
            onClick={close}
          />
          <NavLink
            to="/note-history"
            label="Note history"
            component={Link}
            active={pathname === "/note-history"}
            onClick={close}
          />
          <NavLink
            to="/create-link"
            label="Shorten a URL"
            component={Link}
            active={pathname === "/create-link"}
            onClick={close}
          />
          <NavLink
            to="/mask-link"
            label="Mask a URL"
            component={Link}
            active={pathname === "/mask-link"}
            onClick={close}
          />
          <NavLink
            to="/link-history"
            label="URL history"
            component={Link}
            active={pathname === "/link-history"}
            onClick={close}
          />
        </Box>
      </Drawer>

      <MAppShell.Main>
        <Container p={0} size="120rem">
          {children}
        </Container>
      </MAppShell.Main>
    </MAppShell>
  );
};
