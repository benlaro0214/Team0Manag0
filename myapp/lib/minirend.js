
    

    console.log(input)
    // 2. generate the html
    const output = await genTeamprofile( input )
    // 3. write to a file (writeFileSync)
    fs.writeFileSync(".output/result.txt", output)
    console.log(process.argv)
    // 4. tell the user we're done
    console.log('There You go')
