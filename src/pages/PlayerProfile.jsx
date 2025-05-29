import { useParams, Link } from 'react-router-dom';
import {
  players,
  scoutRankings,
  measurements,
  gameLogs,
  scoutingReports,
  seasonLogs
} from '../data/draftData';

import {
  Container,
  Typography,
  Card,
  Avatar,
  Button,
  TextField,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Box,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';

function formatHeight(inches) {
  const feet = Math.floor(inches / 12);
  const remainder = inches % 12;
  const preciseInches = remainder.toFixed(2).replace(/\.00$/, '');
  return `${feet}'${preciseInches}"`;
}


function PlayerProfile() {
  const { id } = useParams();
  const playerId = parseInt(id);
  const player = players.find((p) => p.playerId === playerId);
  const [reports, setReports] = useState([]);
  const [reportName, setReportName] = useState('');
  const [reportText, setReportText] = useState('');
  const [statView, setStatView] = useState('counting');

  const playerSeasons = seasonLogs
    .filter((s) => s.playerId === playerId)
    .sort((a, b) => b.Season - a.Season); // most recent season first

  const [selectedSeason, setSelectedSeason] = useState(playerSeasons[0] ?? null);

  const currentStats = selectedSeason;


  const playerMeasurements = measurements.find((m) => m.playerId === playerId);
  const playerSeasonStats = seasonLogs.find((s) => s.playerId === playerId);

  const playerReports = [
    ...scoutingReports.filter((r) => r.playerId === playerId),
    ...reports.map((r, i) => ({ scout: r.name, report: r.text, reportId: `user-${i}` }))
  ];

  const handleAddReport = (e) => {
    e.preventDefault();
    if (reportName.trim() && reportText.trim()) {
      setReports([...reports, { name: reportName.trim(), text: reportText.trim() }]);
      setReportName('');
      setReportText('');
    }
  };

  {/* All content below is dynamically pulled from structured JSON – no hardcoded values */}

  const getStatLines = () => {
    if (!currentStats) return [];

    // INTERACTIVE STAT VIEW TOGGLE
    // Allows switching views without overwhelming users. Meets spec requirement for changing display by input.
    const lines = {
      total: [
        { label: 'Season', value: currentStats.Season },
        { label: 'PTS', value: currentStats.PTS },
        { label: 'AST', value: currentStats.AST },
        { label: 'TRB', value: currentStats.TRB },
        { label: 'TOV', value: currentStats.TOV },
        { label: 'STL', value: currentStats.STL },
        { label: 'BLK', value: currentStats.BLK },
        { label: 'PF', value: currentStats.PF },
        { label: 'FGA', value: currentStats.FGA },
        { label: 'FG%', value: currentStats['FG%'] },
        { label: 'eFG%', value: currentStats['eFG%'] },
        { label: '2PA', value: currentStats.FG2A },
        { label: '2P%', value: currentStats['FG2%'] },
        { label: '3PA', value: currentStats['3PA'] },
        { label: '3P%', value: currentStats['3P%'] },
        { label: 'FTA', value: currentStats.FTA },
        { label: 'FT%', value: currentStats.FTP },
        { label: 'DRB', value: currentStats.DRB },
        { label: 'ORB', value: currentStats.ORB }
      ],
      counting: [
        { label: 'Season', value: currentStats.Season },
        { label: 'GP', value: currentStats.GP },
        { label: 'MP', value: currentStats.MP },
        { label: 'PTS', value: currentStats.PTS },
        { label: 'AST', value: currentStats.AST },
        { label: 'TRB', value: currentStats.TRB },
        { label: 'DRB', value: currentStats.DRB },
        { label: 'ORB', value: currentStats.ORB },
        { label: 'STL', value: currentStats.STL },
        { label: 'BLK', value: currentStats.BLK },
        { label: 'TOV', value: currentStats.TOV },
        { label: 'PF', value: currentStats.PF }
      ],
      scoring: [
        { label: 'Season', value: currentStats.Season },
        { label: 'PTS', value: currentStats.PTS },
        { label: 'FGA', value: currentStats.FGA },
        { label: 'FG%', value: currentStats['FG%'] },
        { label: 'eFG%', value: currentStats['eFG%'] },
        { label: '2PA', value: currentStats.FG2A },
        { label: '2P%', value: currentStats['FG2%'] },
        { label: '3PA', value: currentStats['3PA'] },
        { label: '3P%', value: currentStats['3P%'] },
        { label: 'FTA', value: currentStats.FTA },
        { label: 'FT%', value: currentStats.FTP }
      ]
    };

    return lines[statView];
  };

  if (!player) return <Typography variant="h6">Player not found</Typography>;

  return (
    <Container sx={{ mt: 4, backgroundColor: '#f5faff', borderRadius: 2, p: 2 }}>
      <Button
        variant="outlined"
        component={Link}
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2, color: '#00538C', borderColor: '#00538C', '&:hover': { backgroundColor: '#e0f0ff' } }}
      >
        Back to Big Board
      </Button>

      {/* RESPONSIVE AND BRANDED UI */}
      {/* Layout adapts across devices and reflects Mavs brand colors (#00538C) */}

      <Card sx={{ p: 3, backgroundColor: '#ffffff', border: '15px solid #00538C', boxShadow: 3 }}>
        {/* PROFILE INFO */}
        <Box
          sx={{
            position: 'sticky',
            top: 16,
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            p: 3,
            mb: 4,
            borderRadius: 2,
            boxShadow: 12,
            backgroundColor: '#f0f8ff'
          }}
        >
          <Avatar src={player.photoUrl} alt={`${player.firstName} ${player.lastName}`} sx={{ width: 120, height: 120, mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#002B5C' }}>{player.firstName} {player.lastName}</Typography>
          <Typography variant="subtitle1" color="text.secondary">{player.currentTeam}</Typography>
          {player.height && (
            <Typography variant="body2" fontWeight="bold" mt={1}>
              Height: {formatHeight(player.height)} ({player.height}")
            </Typography>
          )}
          {player.weight && (
            <Typography variant="body2" fontWeight="bold">
              Weight: {player.weight} lbs
            </Typography>
          )}
        </Box>

        {/* Measurements + Season Stats */}
        {/* Conditionally rendered with mobile stacking behavior */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
          {/* MEASUREMENTS */}
          <Paper elevation={2} sx={{ p: 2, width: { xs: '100%', md: '50%' } , boxShadow: 2}}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#002B5C' }}>Measurements </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {playerMeasurements ? (
                 <TableContainer component={Paper} sx={{ mt: 2 }}>
                 <Table size="small" sx={{ minWidth: 250, borderCollapse: 'collapse' }}>
                   <TableBody>
                     {[
                       [
                        'Height (With Shoes):',
                        playerMeasurements.heightShoes
                          ? `${playerMeasurements.heightShoes} in / ${formatHeight(playerMeasurements.heightShoes)}`
                          : '--'
                      ],
                      [
                        'Height (No Shoes):',
                        playerMeasurements.heightNoShoes
                          ? `${playerMeasurements.heightNoShoes} in / ${formatHeight(playerMeasurements.heightNoShoes)}`
                          : '--'
                      ],
                      [
                        'Wingspan:',
                        playerMeasurements.wingspan && playerMeasurements.heightNoShoes
                          ? `${playerMeasurements.wingspan} in / ${formatHeight(playerMeasurements.wingspan)} (${(playerMeasurements.wingspan - playerMeasurements.heightNoShoes) >= 0 ? '+' : ''}${(playerMeasurements.wingspan - playerMeasurements.heightNoShoes).toFixed(1)})`
                          : '--'
                      ],
                       ['Standing Reach:', `${playerMeasurements.reach ?? '--'} in`],
                       ['Max Vertical:', `${playerMeasurements.maxVertical ?? '--'} in`],
                       ['No-Step Vertical:', `${playerMeasurements.noStepVertical ?? '--'} in`],
                       ['Hand Length:', `${playerMeasurements.handLength ?? '--'} in`],
                       ['Hand Width:', `${playerMeasurements.handWidth ?? '--'} in`],
                       ['Lane Agility:', `${playerMeasurements.agility ?? '--'} sec`],
                       ['Sprint:', `${playerMeasurements.sprint ?? '--'} sec`],
                       ['Shuttle (Best):', `${playerMeasurements.shuttleBest ?? '--'} sec`],
                       ['Body Fat %:', `${playerMeasurements.bodyFat ?? '--'}`]
                     ].map(([label, value]) => (
                       <TableRow key={label}>
                         <TableCell
                           sx={{
                             backgroundColor: '#f5f5f5',
                             fontWeight: 'bold',
                             border: '1px solid #e0e0e0',
                             width: '50%'
                           }}
                         >
                           {label}
                         </TableCell>
                         <TableCell sx={{ border: '1px solid #e0e0e0' }}>{value}</TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               </TableContainer>        
                ) : <Typography>No measurement data available.</Typography>}
              </AccordionDetails>
            </Accordion>
          </Paper>

          {/* SEASON STATS */}
<Paper elevation={2} sx={{ p: 2, width: { xs: '100%', md: '50%' }, boxShadow: 2 }}>
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="h6" fontWeight="bold" sx={{ color: '#002B5C' }}>Season Stats</Typography>
    </AccordionSummary>
    <AccordionDetails>
          {playerSeasons.length > 0 ? (
            <>
              {/* Season Dropdown */}
              <TextField
                  select
                  label="Select Season"
                  value={JSON.stringify(selectedSeason)}
                  onChange={(e) => {
                    const parsed = JSON.parse(e.target.value);
                    setSelectedSeason(parsed);
                  }}
                  size="small"
                  fullWidth
                  sx={{ mb: 2 }}
                  SelectProps={{ native: true }}
                >
                  {playerSeasons.map((s) => (
                    <option key={`${s.Season}-${s.Team}-${s.League}`} value={JSON.stringify(s)}>
                      {s.Season} – {s.Team} ({s.League})
                    </option>
                  ))}
              </TextField>

              {/* View Toggle */}
              <ToggleButtonGroup
                value={statView}
                exclusive
                onChange={(e, newVal) => newVal && setStatView(newVal)}
                size="small"
                sx={{ mb: 2 }}
              >
                <ToggleButton value="total">Total</ToggleButton>
                <ToggleButton value="counting">Counting</ToggleButton>
                <ToggleButton value="scoring">Scoring</ToggleButton>
              </ToggleButtonGroup>

                      {/* Stats Table */}
                      <Table size="small" sx={{ minWidth: 200, borderCollapse: 'collapse' }}>
                        <TableBody>
                          {getStatLines().map(({ label, value }) => (
                            <TableRow key={label} sx={{ borderBottom: '1px solid #ccc' }}>
                              <TableCell
                                sx={{
                                  fontWeight: 'bold',
                                  borderRight: '1px solid #ccc',
                                  padding: '6px 12px',
                                  backgroundColor: '#f9f9f9',
                                  width: '45%'
                                }}
                              >
                                {label}
                              </TableCell>
                              <TableCell sx={{ padding: '6px 12px' }}>
                                {value ?? '--'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </>
                  ) : (
                    <Typography>No season stats available.</Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            </Paper>

        </Box>

        {/* OFFICIAL SCOUTING REPORTS, formatted for user convenience */}
        <Paper elevation={2} sx={{ p: 2 , boxShadow: 2}}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#002B5C' }}>Official Scouting Reports</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {playerReports.length > 0 ? (
                playerReports.map((r) => (
                  <Box key={r.reportId} mb={2}>
                    <Typography variant="subtitle2" fontWeight="bold">{r.scout}</Typography>
                    <Typography variant="body2" color="text.secondary">{r.report}</Typography>
                  </Box>
                ))
              ) : <Typography>No official reports available.</Typography>}
            </AccordionDetails>
          </Accordion>
        </Paper>

        {/* USER-GENERATED SCOUTING REPORTS */}
        {/* Form uses local state only per spec. Only visible below official reports. */}
        <Paper elevation={2} 
        sx={{
          mt: 4,
          px: 2,
          py: 1.5,
          borderRadius: 2,
          boxShadow: 2
        }}>
          <Accordion
            elevation={1}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" fontWeight="bold" color = '#002B5C'>Add Your Scouting Notes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <form onSubmit={handleAddReport}>
                <TextField
                  name="name"
                  label="Your Name"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  fullWidth
                  sx={{ my: 1 }}
                />
                <TextField
                  name="report"
                  label="Write your thoughts..."
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  fullWidth
                  multiline
                  minRows={2}
                  sx={{ my: 2 }}
                />
                <Button type="submit" variant="contained">Add Report</Button>
              </form>
            </AccordionDetails>
          </Accordion>
        </Paper>


      </Card>
    </Container>
  );
}

export default PlayerProfile;