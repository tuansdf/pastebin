import { Box, LoadingOverlay } from "@mantine/core";

type Props = {
  isLoading?: boolean;
};

export const ScreenLoading = ({ isLoading = true }: Props) => {
  if (!isLoading) return null;

  return (
    <>
      <Box className="k-screen-loading">
        <LoadingOverlay visible={isLoading} overlayProps={{ className: "k-screen-loading-overlay" }} />
      </Box>
    </>
  );
};
