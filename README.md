# Leucoptera coffeella putative secretome analysis

This repository contains scripts, predicted protein sequences,
and supplementary data associated with the study:

"Putative secretome prediction and functional characterization
of Leucoptera coffeella"

# Contents

- `scripts/`: scripts used for data processing and best-hit selection
- `data/`: predicted protein sequences and intermediate results
- `supplementary_tables/`: supplementary datasets associated with the manuscript

# Pipeline

The predicted secretome was obtained using:
- sequence length filtering
- SignalP 6.0
- DeepTMHMM
- TargetP 2.0
- WoLF PSORT
- eggNOG-mapper
- InterProScan
- BLASTp against RefSeq and PDB

# Availability

The files in this repository are provided to support reproducibility
of the analyses described in the manuscript.
