import Drawer from '@mui/material/Drawer';
import DateTime from './DateTime';

function DateDrawer({ open, toggleDrawer, date }: { open: boolean, toggleDrawer: (open: boolean) => () => void, date: Date}) {
  // const [open, setOpen] = useState(false);

  return (
  <>
    <Drawer open={open} onClose={toggleDrawer(false)} anchor='bottom'>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-2">{date.toLocaleDateString("ja-JP", {year: "numeric", month: "2-digit", day: "2-digit"})}</h1>
        <DateTime />
        {/* <Counter /> */}
      </div>
    </Drawer>
  </> 

  );
}

export default DateDrawer;

