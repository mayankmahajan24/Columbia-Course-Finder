  //$('.selectpicker').selectpicker();

var deptList = ["ACLB", "ACTU", "AFSB", "AHAR", "AMSB", "AMST", "ANAT", "ANCB", "ANCS", "ANTB", "ANTH", "APAM", "ARAC", "ARAF", "ARCB", "ARCH", "ARCY", "ARHB", "ASMB", "ASTR", "BCHM", "BIOB", "BIOS", "BIST", "BUSC", "BUSI", "CBME", "CEAC", "CEEM", "CHEM", "CHMB", "CLAS", "CLMS", "CLSB", "CMBS", "CMPL", "COCI", "COLB", "COLM", "COMM", "COMS", "CSER", "CSPB", "DANB", "DESC", "EAEE", "EALC", "ECHB", "ECOB", "ECON", "EDNB", "EEEB", "EESC", "ELEN", "ENCL", "ENGB", "ENGI", "ENSB", "FFPS", "FILB", "FILM", "FRNB", "FRRP", "FUND", "FYSB", "GEND", "GERL", "GRMB", "HINC", "HIST", "HPSC", "HRSB", "HSTB", "HUMR", "ICLS", "IEOR", "INAF", "IRCE", "ITAL", "ITLB", "JAPN", "JAZZ", "JOUC", "LAND", "LAWC", "LAWS", "LING", "LRC", "MATH", "MECE", "MEDI", "MELC", "MIAC", "MICR", "MPAC", "MRSB", "MSAE", "MUSI", "NEUB", "NUTR", "PATH", "PEDB", "PHAR", "PHED", "PHIL", "PHLB", "PHPH", "PHYB", "PHYG", "PHYS", "PLSB", "POLS", "PSYB", "PSYC", "PUHS", "QMSS", "RELB", "RELI", "SCPB", "SCTS", "SCWS", "SIPX", "SLAL", "SOCB", "SOCI", "SOCW", "SOSC", "SPNB", "SPPO", "STAT", "SUDV", "TCOS", "THEA", "THEB", "UBST", "UNSC", "URBS", "URPL", "VIAR", "WMST", "WPGS", "WSTB"];
for (var i = 0; i < deptList.length; i++) 
{
    document.write(  ('<option value="' + deptList[i] +'">' + deptList[i] + '</option> '));
//alert(myStringArray[i]);
    //Do something
}

