import { Skeleton, Stack, SkeletonProps } from "@mui/material";

interface SkeletonLoadingProps extends SkeletonProps {
    count?: number;
    spacing?: number;
}

export default function SkeletonLoading({
    count = 1,
    spacing = 1,
    variant = 'rounded',
    width = '100%',
    height = 40,
    ...other
}: SkeletonLoadingProps) {
    return (
        <Stack spacing={spacing} width="100%">
            {[...Array(count)].map((_, index) => (
                <Skeleton
                    key={index}
                    variant={variant}
                    width={width}
                    height={height}
                    {...other}
                />
            ))}
        </Stack>
    );
}
