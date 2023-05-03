import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#0095EF",
        },
        background: {
            default: "#00ABF1",
        },
        text : {
            secondary: "rbga(255,255,255,0.6)",
        },
    }
})

export default theme;