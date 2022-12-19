const express = require('express')
const router = express.Router();
const cpus = require ('os');
// const { fork } = require('child_process');



router.get('/info', async (req, res) => {
    data = {
        'arguments': process.argv,
        'platform': process.platform,
        'node-version': process.version,
        'memory': process.memoryUsage.rss(),
        'execpath': process.execPath,
        'pid': process.pid,
        'folder': process.execPath,
        'cpu': cpus.lenght
    }

    res.render('info', {data: data})
    console.log(data)
})
router.get('/randoms',(req,res)=>{
    const {cantidad} = req.query;
    let cantEnviada
    if(cantidad){
        cantEnviada = cantidad;
    }else{
        cantEnviada = 100000000
    }
    res.send(cantEnviada)
    // fork.on('message',(randoms)=>{
    //     res.send({'Números Random': randoms})
    // })
    // fork.send(cantEnviada)
})

module.exports = router;