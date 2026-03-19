import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

type TableNoDataProps = {
    message: string;
    inTable?: boolean;
}

export function TableNoData({ message, inTable = true }: TableNoDataProps) {
  const content = (
    <Box sx={{ py: 4, textAlign: "center" }}>
      <Typography variant="h6">{message}</Typography>
    </Box>
  );

  if (inTable) {
    return (
      <TableRow>
        <TableCell align="center" colSpan={7}>
          {content}
        </TableCell>
      </TableRow>
    );
  }

  return content;
}
