import Modal from "@mui/material/Modal";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";

const FormModal = ({ isOpen, onSubmit, onClose, children }) => {

    return (
        <Modal
            open={isOpen}
            onClose={()=> onClose()}
        >
            <Grid
                container
                alignItems={"center"}
                justifyContent={"center"}
                sx={{ height: "100%" }}
            >
                <FormControl
                    component={"form"}
                    onSubmit={(e) => onSubmit(e)}
                    sx={{
                        background: "#fff",
                        margin: 2,
                        gap: 4,
                        maxWidth: "600px",
                        padding: "1rem",
                        borderRadius: "8px",
                        alignItems: "center",
                        justifyContent:"center",
                        flexWrap: "wrap",
                        flexDirection:"row",
                    }}
                    fullWidth
                >
                    {children}
                </FormControl>
            </Grid>
        </Modal>
    );
};

export default FormModal;
