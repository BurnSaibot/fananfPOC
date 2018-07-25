#!/bin/bash
function usage() {
    printf "usage : $0 -f/--format format [options] -i/--input videoFilePath \n"
    printf "available format : srt, webvtt, all \n"
    printf "Other options : \n"
    printf "\t -o/--output outFilePath (existing)(if not specified,outputs will be created in current folder !) \n"
    printf "\t -h/--help help"
}

function createFolders() {
    echo "creating needed folders"
    echo `mkdir $folder`
    echo `mkdir $folder/videos`
    echo `mkdir $folder/audio`
    echo `mkdir $folder/transcriptions`
    echo `mkdir $folder/sousTitresGeneres`
}

function doConversion() {
    echo "Converting into mp4 if needed"
    if [ "$extension" = "mp4" ]
    then
	echo "bon format : pas besoin de convertion"
    else
	echo "mauvais format : conversion en mp4"
	echo `/bin/bash /vol/work2/cerveau/scripts/videoToMP4.sh $file`
	echo `mv $filename.mp4 $folder/videos`	
    fi
}

function extractingAudio() {
    echo "Extracting audio"
    echo `ffmpeg -i $inFile $folder/audio/$filename.mp3`
    echo `mv $file $folder/videos`  
}

function xmlFromVocapia() {
    echo "Getting transcription from vocapia"
    echo `curl -ksS -u cerveau:w4SAuEVL https://rest1.vocapia.com:8093/voxsigma -F method=vrbs_trans -F model=fre -F audiofile=@$folder/audio/$filename.mp3 > $folder/transcriptions/transcription$filename.xml`
}

function generatingSub() {
    echo "Starting to generate subtiles files"
    #echo "$1"
    if [ "$1" = "srt" ]
    then
	echo `python /vol/work2/cerveau/scripts/xmlToSub/xmlToSub.py --srt $folder/transcriptions/transcription$filename.xml > $folder/sousTitresGeneres/$filename.srt`
    elif [ "$1" = "vtt" ]
    then
	echo `python /vol/work2/cerveau/scripts/xmlToSub/xmlToSub.py --webvtt $folder/transcriptions/transcription$filename.xml > $folder/sousTitresGeneres/$filename.vtt`
    elif [ "$1" = "all" ]
    then
	echo `python /vol/work2/cerveau/scripts/xmlToSub/xmlToSub.py --srt $folderilename/transcriptions/transcription$filename.xml > $folder/sousTitresGeneres/$filename.srt`
	echo `python /vol/work2/cerveau/scripts/xmlToSub/xmlToSub.py --webvtt $folder/transcriptions/transcription$filename.xml > $folder/sousTitresGeneres/$filename.vtt`
    fi
}
if [ $# -eq 0 ]
then
    usage
    exit 1
fi

getopt --test > /dev/null
if [[ $? -ne 4 ]]; then
    echo "I’m sorry, `getopt --test` failed in this environment."
    exit 1
fi



OPTS=$(getopt --options=f:o:i:h --longoptions=format:,output:,input:,help --name "$0" -- "$@")
if [ $? !=  0 ]
then
    exit 1
fi
echo "$OPTS"
eval set -- "$OPTS"
while true; do
    case "$1" in
        -f|--format)
	    f="y"
	    format="$2"
	    shift 2
	    ;;
        -o|--output)
	    o="y"
            outFile="$2/"
            shift 2
            ;;
	-i|--input)
	    i="y"
            inFile="$2"
	    execPath=$(readlink -f $(dirname $2))
	    file=$(basename -- $inFile)
	    filename="${file%.*}"
	    extension="${file#*.}"
	    #echo "i=$i inflie=$inFile execPath=$execPath file=$file filename=$filename extension=$extension"
            shift 2
            ;;
	-h|--help)
	    usage
	    exit 0
	    shift 2
	    ;;
        --)
            shift
            break
            ;;
        *)
            echo "Programming error"
            exit 3
            ;;
    esac
done

if [ "$o" = "y" ]
then
    folder="$outFile$filename"
else
    #echo "ça sent la douille"
    folder="$filename"
fi

if [ "$f" != "y" ]
then
    echo "il manque un format"
    usage
    exit 1
fi

if [ "$i" != "y" ]
then
    echo "il manque un fichier d'entrée"
    usage
    exit 1
fi

echo "Folder = $Folder"
createFolders
doConversion
extractingAudio
#echo "$format"
xmlFromVocapia
generatingSub "$format"



