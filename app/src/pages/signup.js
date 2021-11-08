import Typography from "@mui/material/Typography"

export const Signup = () => {
  return (
    <div style={{ background: "#5A189A", flex: 1, display: "flex" }}>
      <div style={{ maxWidth: 700, width: "100%", margin: "auto" }}>
        <Typography variant="h4" sx={{ color: "#FFFFFF" }}>
          Create your PlanIt account
        </Typography>
      </div>
    </div>
  )
}
