<template>
    <div class="relative w-12 h-8 p-2 flex items-center justify-center">
            <svg class="w-auto h-6  " width="211"   height="116" viewBox="0 0 211 116" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="Logo">
                    <path
        id="roof" d="M10.8166 68L8 62.0392L103.765 20L200 61.8824L197.34 67.6863L103.765 28.1569L10.8166 68Z"
                        fill="#FCF448" />
                    <g id="chimney">
                        <path id="Vector 2" d="M93 21V12H115V21L103.841 16.8L93 21Z" fill="#FCF448" />
                        <rect id="Rectangle 1" x="91" y="6" width="26" height="4" fill="#FCF448" />
                    </g>
                    <g id="post2">
                        <path
        id="Vector 5" class="rotate" fill-rule="evenodd" clip-rule="evenodd"
                            d="M63.1304 52V53.2727H61V91.7727H63.1304V94H66.1739V91.7727H68V53.2727H66.1739V52H63.1304ZM64.9565 73.9545V57.7273H66.7826V73.9545H64.9565Z"
                            fill="#FCF448" />
                        <path
        id="Vector 7"  class="rotate1" fill-rule="evenodd" clip-rule="evenodd"
                            d="M102.435 37V38.2597H100V91.7956H102.435V94H105.913V91.7956H108V38.2597H105.913V37H102.435ZM104.522 66.9171V42.0387H106.609V66.9171H104.522Z"
                            fill="#FCF448" />
                        <path
        id="Vector 8"  class="rotate" fill-rule="evenodd" clip-rule="evenodd"
                            d="M142.435 52V53.2597H140V106.796H142.435V109H145.174V106.796H147V53.2597H145.174V52H142.435ZM144.261 81.9171V57.0387H146.087V81.9171H144.261Z"
                            fill="#FCF448" />
                    </g>
                    <g id="post1">
                        <path
        id="Vector 3"  class="rotate"
                            d="M122.435 48.0392V46H124.87V47.8824H127V55.4118H124.87V58.8627H127V66.0784H124.87V69.5294H127V76.7451H124.87V80.1961H127V87.7255H124.87V94H122.435V87.7255H120V80.1961H122.435V76.7451H120V69.5294H122.435V66.0784H120V58.8627H122.435V55.4118H120V48.0392H122.435Z"
                            fill="#FCF448" />
                        <path
        id="Vector 4"  class="rotate"
                            d="M82.4348 47.8824V46H84.8696V47.8824H87V55.4118H84.8696V58.8627H87V66.0784H84.8696V69.5294H87V76.7451H84.8696V80.1961H87V87.7255H84.8696V94H82.4348V87.7255H80V80.1961H82.4348V76.7451H80V69.5294H82.4348V66.0784H80V58.8627H82.4348V55.4118H80V47.8824H82.4348Z"
                            fill="#FCF448" />
                        <path
        id="Vector 6"  class="rotate"
                            d="M42.2273 65.4742V63H44.7727V65.4742H47V71.6598H44.7727V73.5155H47V80.6289H44.7727V82.4845H47V89.2887H44.7727V93H42.2273V89.2887H40V82.4845H42.2273V80.6289H40V73.5155H42.2273V71.6598H40V65.4742H42.2273Z"
                            fill="#FCF448" />
                        <path
        id="Vector 9"  class="rotate"
                            d="M161.227 65.4742V63H163.773V65.4742H166V71.6598H163.773V73.5155H166V80.6289H163.773V82.4845H166V89.2887H163.773V93H161.227V89.2887H159V82.4845H161.227V80.6289H159V73.5155H161.227V71.6598H159V65.4742H161.227Z"
                            fill="#FCF448" />
                    </g>
                </g>
            </svg>

         <img src="~/assets/imgs/ribshack_logo_bg.png" class="absolute top-0 -z-10" >
    </div>
</template>

<style>
.logo {
    animation: 1s appear;
    margin: auto;
}

#chimney,
#roof,
#post1,
#post2 {
    transition: all 1s ease;
}

#post1 {
    animation: appear 1s ease;
}

#post2 {
    animation: appear2 1s ease;
}




@keyframes pulseReverse {
    0% {
        opacity: 100%;
    }

    50% {
        opacity: 0;
    }

    100% {
        opacity: 100%;
    }
}


#chimney,
#roof {
    animation: flip2 1s ease;
}

@keyframes appear {
    0% {
        opacity: 0;
        transform: translateY(-100%);
    }

    100% {
        opacity: 100%;
        transform: translateY(0%);
    }
}

@keyframes appear2 {
    0% {
        opacity: 0;
        transform: translateY(100%);
    }

    100% {
        opacity: 100%;
        transform: translateY(0%);
    }
}

@keyframes flip2 {
    0% {
        opacity: 0;
        transform: translateZ(100%);
    }

    100% {
        opacity: 100%;
        transform: translateZ(0%);
    }
}
</style>
