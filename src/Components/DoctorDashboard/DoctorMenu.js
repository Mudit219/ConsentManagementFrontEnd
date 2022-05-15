import InboxIcon from '@mui/icons-material/MoveToInbox';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import HandshakeIcon from '@mui/icons-material/Handshake';

const doctorMenu=[
    {
        text:"E-Health-Records",
        path:"/E-Health-Records",
        icon:<AssignmentIcon/>
    },
    {
        text:"Request Consent",
        path:"/Request-Consent",
        icon:<EmojiPeopleIcon/>
    },
    {
        text:"Connected Patient",
        path:"/Connected-Patients",
        icon:<HandshakeIcon/>
    },
    {
        text:"Notifications",
        path:"/Notifications",
        icon:<NotificationsIcon/>
    },
    {
        text:"Logs",
        path:"/Logs",
        icon:<AnalyticsIcon/>
    },
    {
        text:"My Profile",
        path:"/Profile",
        icon:<AccountCircleIcon/>
    }
]

export default doctorMenu;