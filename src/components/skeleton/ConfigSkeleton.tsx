import { Stack, Skeleton } from "@mui/material";

const ConfigSkeleton = () => (
    <Stack spacing={1} sx={{
        padding: "8px 60px"
    }}>
        <Skeleton variant="rounded" sx={{
            width: "100%",
            height: "60px",
        }} />
        <Skeleton variant="rounded" sx={{
            width: "100%",
            height: "80vh",
        }} />
    </Stack>
);


export default ConfigSkeleton;