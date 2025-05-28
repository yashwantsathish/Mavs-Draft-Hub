import { players, scoutRankings } from '../data/draftData';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Avatar,
  TableSortLabel,
  Box
} from '@mui/material';
import { useState } from 'react';

// Compute average rank from all available (non-null) scout values for a given player
// Business Logic: This method supports both sorting and scout color logic by aggregating present rankings only
function calculateAverageRank(playerId) {
  const playerRanks = scoutRankings.find((r) => r.playerId === playerId);
  if (!playerRanks) return null;

  const values = Object.entries(playerRanks)
    .filter(([key]) => key !== 'playerId')
    .map(([, val]) => val)
    .filter((val) => typeof val === 'number');

  if (values.length === 0) return null;

  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  return avg.toFixed(2);
}

function BigBoard() {
  const [sortScout, setSortScout] = useState(null);     // Currently selected scout to sort by
  const [sortDirection, setSortDirection] = useState('asc');  // Sort order: ascending or descending

  // Dynamically extract list of scout names from the data structure
  const scoutNames = scoutRankings.length
    ? Object.keys(scoutRankings[0]).filter((key) => key !== 'playerId')
    : [];

  // Sorting players either by a specific scout or by their average ranking
  // Product Consideration: Null values are pushed to the bottom to avoid visual noise when comparing ranked prospects
  const sortedPlayers = [...players].sort((a, b) => {
    const aRanks = scoutRankings.find((r) => r.playerId === a.playerId) || {};
    const bRanks = scoutRankings.find((r) => r.playerId === b.playerId) || {};

    let aVal, bVal;

    if (sortScout) {
      // Custom logic: Null values (unranked players) always appear at the bottom for clean view
      aVal = aRanks[sortScout];
      bVal = bRanks[sortScout];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    } else {
      // Default sort is based on average rank across all scouts
      const aAvg = parseFloat(calculateAverageRank(a.playerId));
      const bAvg = parseFloat(calculateAverageRank(b.playerId));
      aVal = isNaN(aAvg) ? Infinity : aAvg;
      bVal = isNaN(bAvg) ? Infinity : bAvg;
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
  });

  // Handles toggle of column sorting
  const handleSort = (scout) => {
    if (sortScout === scout) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortScout(scout);
      setSortDirection('asc');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      {/* Title Bar */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4" fontWeight="bold" color="#00538C">
          Mavs Draft Big Board
        </Typography>
        <img
          src="https://upload.wikimedia.org/wikipedia/en/thumb/9/97/Dallas_Mavericks_logo.svg/1920px-Dallas_Mavericks_logo.svg.png"
          alt="Mavs Logo"
          style={{ height: 50 }}
        />
      </Box>

      {/* UX Decision: Explain the color logic for context-aware sorting analysis */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        <strong>Note:</strong> For each player, scout rankings are color-coded:
        <span style={{ color: 'green', fontWeight: 'bold' }}> green</span> = scout is higher than average,
        <span style={{ color: 'red', fontWeight: 'bold' }}> red</span> = scout is lower than average.
      </Typography>

      {/* Main Table */}
      <Paper elevation={4} sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#00538C' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Player</TableCell>
              {/* Dynamically generated scout columns */}
              {scoutNames.map((scout) => (
                <TableCell key={scout} sx={{ color: 'white', fontWeight: 'bold' }}>
                  <TableSortLabel
                    active={sortScout === scout}
                    direction={sortScout === scout ? sortDirection : 'asc'}
                    onClick={() => handleSort(scout)}
                    sx={{ color: 'white', '&.Mui-active': { color: 'white' } }}
                  >
                    {scout}
                  </TableSortLabel>
                </TableCell>
              ))}
              {/* Avg Rank Column */}
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                <TableSortLabel
                  active={!sortScout}
                  direction={!sortScout ? sortDirection : 'asc'}
                  onClick={() => {
                    if (!sortScout) {
                      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                    } else {
                      setSortScout(null);
                      setSortDirection('asc');
                    }
                  }}
                  sx={{ color: 'white', '&.Mui-active': { color: 'white' } }}
                >
                  Avg Rank
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {sortedPlayers.map((player) => {
              const ranks = scoutRankings.find((r) => r.playerId === player.playerId) || {};
              const avgRank = calculateAverageRank(player.playerId);

              return (
                <TableRow key={player.playerId} hover>
                  {/* Player Info Cell */}
                  <TableCell>
                    <Link to={`/player/${player.playerId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {player.photoUrl && (
                          <Avatar
                            src={player.photoUrl}
                            alt={`${player.firstName} ${player.lastName}`}
                            sx={{ width: 36, height: 36 }}
                          />
                        )}
                        <Typography fontWeight="500">
                          {player.firstName} {player.lastName}
                        </Typography>
                      </Box>
                    </Link>
                  </TableCell>

                  {/* Rank cells per scout */}
                  {scoutNames.map((scout) => {
                    const rank = ranks[scout];
                    const availableRanks = scoutNames
                      .map((s) => ranks[s])
                      .filter((val) => typeof val === 'number');

                    const avgRankValue =
                      availableRanks.length > 0
                        ? availableRanks.reduce((a, b) => a + b, 0) / availableRanks.length
                        : null;

                    let color = 'inherit';
                    if (rank != null && avgRankValue != null) {
                      const diff = rank - avgRankValue;
                      if (diff <= -2) color = 'green';
                      else if (diff >= 2) color = 'red';
                    }

                    return (
                      <TableCell key={scout} style={{ color }}>
                        {rank ?? '--'}
                      </TableCell>
                    );
                  })}

                  {/* Final avg rank cell */}
                  <TableCell>{avgRank ?? '--'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

export default BigBoard;
