$(document).ready(function(){
    //Time of calculation measuring start
    var StartTime = performance.now();       

    //------------FUNCTIONS FOR CALCUCLATIONS--------------------------
    //Sigmoid function
    function Sigmoid (x) {
        var output = 1 / (1 + Math.exp(-x));
        return output;
    }

    //Sigmoid function derivative
    function SigmoidDer (x) {            
        var output = (x * (1 - x));            
        return output;
    }

    //Random numbers in selected range (min included, max not)
    function Random (min, max) {            
        return (Math.random() * (max - min) + min);
    }

    //Multiply 2 matrixes (matrix and vector)
    function Multiply (mat, vect) {            
        var output = [];

        //Sets all array fields to zero, else next loop will cause NaN
        for (i = 0; i < mat.length; i++) {
            output[i] = 0;
        }

        for (i = 0; i < mat.length; i++) {
           for (j = 0; j < vect.length; j++) {                   
               output[i] += (mat[i][j] * vect[j]);                                     
           }               
        }               

        return output;
    }       

    //Transpose matrix (not my code)
    //Source: http://www.codesuck.com/2012/02/transpose-javascript-array-in-one-line.html        
    function Transpose(a) {
        return Object.keys(a[0]).map(function (c) {
            return a.map(function (r) {
                return r[c];
            });
        });
    }

    //--------------DECLARE, FILL AND PRINT MATRIXES------------------------

    //Declaration of arrays (matrixes)
    var InputMatrix = [];
    var ResultMatrix = [];
    var RandomMatrix = [];                     

    //Fill input matrix
    InputMatrix[0] = [0, 0, 1];        
    InputMatrix[1] = [1, 1, 1];
    InputMatrix[2] = [1, 0, 1];
    InputMatrix[3] = [0, 1, 1];

    //Fill input matrix with random numbers 0 or 1
    /*InputMatrix[0] = [Math.floor(Math.random()), Math.floor(Math.random()), Math.floor(Math.random())];        
    InputMatrix[1] = [Math.floor(Math.random()), Math.floor(Math.random()), Math.floor(Math.random())];
    InputMatrix[2] = [Math.floor(Math.random()), Math.floor(Math.random()), Math.floor(Math.random())];
    InputMatrix[3] = [Math.floor(Math.random()), Math.floor(Math.random()), Math.floor(Math.random())];*/

    //Fill result matrix
    ResultMatrix[0] = [0];
    ResultMatrix[1] = [1];
    ResultMatrix[2] = [1];
    ResultMatrix[3] = [0];

    //Read input matrix a print
    for (i = 0; i < InputMatrix.length; i++) {
        for (j= 0; j < InputMatrix[j].length; j++) {                
            $("#InputMatrix").append(InputMatrix[i][j] + "&nbsp;&nbsp;&nbsp;&nbsp;");                
        }            
        $("#InputMatrix").append("<br>");
    }

    //Read result matrix and print
    for (i = 0; i < ResultMatrix.length; i++) {                           
        $("#ResultMatrix").append(ResultMatrix[i] + "<br>");  
    }                        

    //Fill random matrix with random numbers (-1 to 1) - random weighs
    for (i = 0; i < InputMatrix[1].length; i++) {
        RandomMatrix[i] = Random (-1, 1);
    }             

    //Read random matrix and print              
    for (i = 0; i < RandomMatrix.length; i++) {                           
        $("#RandomMatrix").append(RandomMatrix[i] + "<br>");  
    }    

    //Declaration of arrays and variable needed for training
    var temp = [];
    var temp2 = [];
    var L0 = [];        
    var L1 = [];
    var syn0 = [];
    var L1error = [];
    var L1delta = [];
    var iterations = 0;    
    
    //Show the number of interations
    $("#progress").text("Progresss: " + iterations + " iterations"); 

    //------------LEARNING (TRAINING)---------------------------------------
    for (z = 0; z < 50000; z++) {
        //L0 - 1. layer of neural network = input data (matrix)
        L0 = InputMatrix;
        //syn0 - Synapse 0 connnets 1. layer and 2. layer (L0, L1)
        syn0 = RandomMatrix;

        //Apply random weighs (multiply L0 matrix and random matrix)
        temp = Multiply(L0, syn0);

        //Use Sigmoid function to normalise data (0 to 1)
        //This creates 2. layer (hidden layer) L1
        for (j = 0; j < L0.length; j++) {
            L1[j] = Sigmoid(temp[j]);
        }                      

        //Calculate error = random guess - desired outp values 
        for (j = 0; j < L1.length; j++) {
            L1error[j] = ResultMatrix[j] - L1[j];                
        }

        //Adjust the error using Sigmoid function derivative
        //If the guess is close to 0 o 1, network is sure of result -> low adjustment
        //If the guess is close to 0,5 , network isn't sure of result -> high adjustment
        for (j = 0; j < L1.length; j++) {
            L1delta[j] = L1error[j] * SigmoidDer(L1[j]); 
        }

        //Udpate weighs - multiply L0 and L1delta matrixes and put result to Synapse 0
        temp2 = Multiply(Transpose(L0), L1delta)                                              
        for (j = 0; j < temp2.length; j++) {         
            syn0[j] += temp2[j];                
        }

        //Numer of iterations counter (not related directly to neural network)
        iterations++;            
    }
            
    //--------------PRINT NEW UPDATED MATRIXES-----------------------------

    //Print updated synapse 0 (random matrix) with leraned weighs 
    for (i = 0; i < RandomMatrix.length; i++) {
        $("#LearnedMatrix").append(syn0[i] + "<br>");
    }

    //Print updated result matrix + its rounded version to show clearly the result 
    for (i = 0; i < L1.length; i++) {
        $("#ResultMatrix2").append(L1[i] + "<br>");
        $("#ResultMatrix2rounded").append(Math.round(L1[i]) + "<br>");            
    }
    

    //-------------- NEW SITUATION (new input set)------------------------

    //Declaration of arrays for new situation - new matrix row
    var NewInputMatrix = [1, 1, 0];
    var NewL0 = [];
    var NewL1;
    var newtemp;                          


    NewL0 = NewInputMatrix;       

    //Apply learned weighs from previdou iterations to the new input data set
    newtemp = (NewL0[0] * RandomMatrix[0]) + (NewL0[1] * RandomMatrix[1])+ (NewL0[2] * RandomMatrix[2]);

    //Normalise data with Sigmoid function
    NewL1 = Sigmoid(newtemp);        
    
    //Print new input set and result
    $("#NewInput").append(NewL0[0]+ "&nbsp;&nbsp;&nbsp;&nbsp;" + NewL0[1] + "&nbsp;&nbsp;&nbsp;&nbsp;" + NewL0[2]);        
    $("#NewResult").append(NewL1);        


    //Time of calculation end (form calculation time measuring)        
    var EndTime = performance.now();
    
    //Displays calculation time rounded for 2 decimal places
    $("#Stats").append("Calculation time: " + (Math.round((EndTime - StartTime) * 100) / 100) + " ms <br>");
    $("#Stats").append("Iterations: " + iterations + "<br>");        
});
