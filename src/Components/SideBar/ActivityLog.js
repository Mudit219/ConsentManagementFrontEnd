import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles({
//   element: {
//     position: 'relative',
//     border: '1px solid #ccc',
//     /* border-radius: 4px; */
//     padding: '10px',
//     fontSize: '50px',
//     height: '40px',
//     '&::after': {
//       content: '""',
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       width: '40px',
//       height: '50%',
//       borderLeft: '4px solid #ccc',
//       borderBottom: '4px solid #ccc',
//       borderBottomLeftRadius: '50%',
//       /* backgroundColor: '#ccc', */
//     },
//     '&::before, &::after': {
//       zIndex: -1,
//     },
//   },
// });


import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#f7f7f7',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    width: 400,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  title: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: 'bold',
  },
  icon: {
    color: theme.palette.secondary.main,
    fontSize: theme.typography.pxToRem(36),
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  listItem: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const ActivityLog = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.title}>Activity Log</div>
        <div className={classes.icon}>icon</div>
      </div>
      <Divider />
      <List className={classes.list}>
        <ListItem className={classes.listItem}>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>A</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="User logged in"
            secondary="Yesterday at 8:00 PM"
          />
        </ListItem>
        <ListItem className={classes.listItem}>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>B</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="New user registered"
            secondary="Yesterday at 7:00 PM"
          />
        </ListItem>
        <ListItem className={classes.listItem}>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>C</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="User updated profile information"
            secondary="Yesterday at 6:00 PM"
          />
        </ListItem>
      </List>
    </div>
  );
};

export default ActivityLog;

// export default ActivityLog;

// export default function ActivityLog() {
//   const classes = useStyles();

//   return (
//     <div className={classes.element}>
//       Hello World
//     </div>
//   );
// }