import { styled } from "@mui/system";
import { Grid } from "@mui/material";
import { NoteList } from "./noteList/NoteList";
import { DrawerHeader } from "./drawerHeader/DrawerHeader";
import { DrawerFooter } from "./drawerFooter/DrawerFooter";

const MyGrid = styled(Grid)(
  ({ theme }) => `
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${theme.palette.primary.main};
  `
);

const TopGrid = styled(Grid)(`
  padding: 8px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`);

const HeaderGrid = styled(Grid)(`
  margin-bottom: 16px;
`);

export const NoteDrawer = () => {
  return (
    <MyGrid container direction="column" justifyContent="space-between">
      <TopGrid>
        <HeaderGrid>
          <DrawerHeader />
        </HeaderGrid>
        <NoteList />
      </TopGrid>
      <DrawerFooter />
    </MyGrid>
  );
};
