const path = require('path');
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3').default;

async function main() {
    try
    {
        console.log('Using solc version:', solc.version());

        const contractPath = path.resolve(__dirname, '..', 'contracts', 'CropInsuranceContract.sol');
        const source = fs.readFileSync(contractPath, 'utf8');

        console.log('Reading source file...');
        console.log('Contract source loaded successfully');

        console.log('Compiling contract...');
        const input = {
            language: 'Solidity',
            sources: {
                'CropInsuranceContract.sol': {
                    content: source,
                },
            },
            settings: {
                viaIR: true, // Enable IR-based code generation
                optimizer: {
                    enabled: true,
                    runs: 200,
                },
                outputSelection: {
                    '*': {
                        '*': ['*'],
                    },
                },
            },
        };

        const compiled = JSON.parse(solc.compile(JSON.stringify(input)));

        if (compiled.errors)
        {
            const hasError = compiled.errors.some(error => error.severity === 'error');
            if (hasError)
            {
                compiled.errors.forEach(error => {
                    console.error(error.formattedMessage);
                });
                throw new Error('Contract compilation failed');
            } else
            {
                console.log('Compilation warnings:');
                compiled.errors.forEach(error => {
                    console.warn(error.formattedMessage);
                });
            }
        }

        const contractFile = 'CropInsuranceContract.sol';
        const contractName = 'CropInsuranceContract';

        console.log('Getting contract binary and ABI...');
        const contract = compiled.contracts[contractFile][contractName];
        const bytecode = contract.evm.bytecode.object;
        const abi = contract.abi;

        const buildDir = path.resolve(__dirname, '..', 'build');
        if (!fs.existsSync(buildDir))
        {
            fs.mkdirSync(buildDir);
        }

        fs.writeFileSync(
            path.resolve(buildDir, 'CropInsuranceContract_abi.json'),
            JSON.stringify(abi, null, 2)
        );
        fs.writeFileSync(
            path.resolve(buildDir, 'CropInsuranceContract_bytecode.json'),
            bytecode
        );

        console.log('Contract artifacts saved to build directory');

        console.log('Connecting to network...');
        const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
        const web3 = new Web3(provider);

        const isListening = await web3.eth.net.isListening();
        if (!isListening)
        {
            throw new Error('Could not connect to Ganache. Make sure it is running.');
        }
        console.log('Connected to network');

        const accounts = await web3.eth.getAccounts();
        if (!accounts || accounts.length === 0)
        {
            throw new Error('No accounts found in the network');
        }

        const fromAccount = accounts[0];
        console.log('Deploying from account:', fromAccount);

        const cropInsuranceContract = new web3.eth.Contract(abi);
        console.log('Deploying contract...');

        const deployedContract = await cropInsuranceContract.deploy({
            data: '0x' + bytecode
        }).send({
            from: fromAccount,
            gas: 6000000, // Increased gas limit
            gasPrice: web3.utils.toWei('20', 'gwei')
        });

        console.log('Contract deployed successfully at address:', deployedContract.options.address);

        fs.writeFileSync(
            path.resolve(buildDir, 'CropInsuranceContract_address.txt'),
            deployedContract.options.address
        );

    } catch (error)
    {
        console.error('Error occurred:', error);
        process.exit(1);
    }
}

main();