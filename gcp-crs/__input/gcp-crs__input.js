export default function gcpCrsAddOptions(crsInp) {
    fetch('./epsg_api_coordrefsys.json')
        .then((response) => response.json())
        .then((epsgDb) => {
            crsInp.disabled = false;
            
            epsgDb.Results.forEach((result) => 
                crsInp.list.appendChild(
                    new Option(result.Name, `EPSG:${result.Code}`)
                )
            );
            
            crsInp.addEventListener('input', () => 
                crsInp.epsgCode = crsInp.value
            );
        }
    );
}
